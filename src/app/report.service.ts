import { Injectable, Input } from "@angular/core";
import {
  EntityModel,
  ReportFieldInterface,
  FieldQueryInterface,
  ReportInterface,
  ReportFormatInterface
} from "serendip-business-model";
import * as _ from "lodash";
import { DataService } from "./data.service";
import { IdbService } from "./idb.service";
import { WebWorkerService } from "./web-worker.service";
import ObjectID from "bson-objectid";
import { ObService } from "./ob.service";
import * as moment from "moment-jalaali";
import * as Moment from "moment";
import { spawn } from "threads";
import { ReportsSchema } from "./schema";
export const DateUnitToFormatMap = {
  minute: "YYYY-MM-DD kk:mm",
  hour: "YYYY-MM-DD kk",
  day: "jYYYY/jMM/jDD",
  month: "YYYY-MM",
  year: "YYYY",
  jMonth: "jYYYY/jMM",
  jYear: "jYYYY"
};
// if (formatOptions.dateRangeUnit === "minute") {
//   formatOptions.dateRangeFormat = "kk-mm";
// }
// if (formatOptions.dateRangeUnit === "hour") {
//   formatOptions.dateRangeFormat = "kk";
// }
// if (formatOptions.dateRangeUnit === "month") {
//   formatOptions.dateRangeFormat = "YYYY-MM";
// }
// if (formatOptions.dateRangeUnit === "year") {
//   formatOptions.dateRangeFormat = "YYYY-MM";
// }
// if (formatOptions.dateRangeUnit === "jMonth") {
//   formatOptions.dateRangeFormat = "jYYYY-jMM";
// }
// if (formatOptions.dateRangeUnit === "jYear") {
//   formatOptions.dateRangeFormat = "jYYYY";
// }

@Injectable({
  providedIn: "root"
})
export class ReportService {
  formatReportQueue: any;
  formatterBusy: boolean;
  constructor(
    private dataService: DataService,
    private idbService: IdbService,
    private obService: ObService,
    private webWorker: WebWorkerService
  ) {
    // moment.loadPersian();
  }

  createMatchStageQuery(report: ReportInterface) {
    const fieldsWithQuery = report.fields.filter(
      p => p.queries && p.queries.find(d => d.enabled)
    );

    const matchQuery = {
      _entity: report.entityName
    };

    fieldsWithQuery.forEach(f => {
      f.queries
        .filter(p => p.enabled)
        .forEach(q => {
          if (q.method === "neq-null") {
            matchQuery[f.name] = {
              $nin: [null, []],
              $exists: true
            };
          }

          if (q.method === "string-eq") {
            matchQuery[f.name] = q.methodInput.value;
          }

          if (q.method === "string-neq") {
            matchQuery[f.name] = { $ne: q.methodInput.value };
          }

          if (q.method === "string-contain" && q.methodInput.value) {
            matchQuery[f.name] = {
              $regex: `${q.methodInput.value}`,
              $options: "i"
            };
          }

          if (q.method === "date-in-range" && q.methodInput.value) {
            matchQuery[f.name] = {};

            if (q.methodInput.value.from) {
              matchQuery[f.name].$gte = Moment(
                q.methodInput.value.from
              ).valueOf();
            }

            if (q.methodInput.value.to) {
              matchQuery[f.name].$lte = Moment(
                q.methodInput.value.to
              ).valueOf();
            }
          }
        });
    });

    return matchQuery;
  }

  async generate(
    report: ReportInterface,
    skip: number = 0,
    limit: number = 0,
    offline = false
  ) {
    if (!report) {
      return;
    }
    if (!report.fields) {
      report.fields = [];
    }

    const pipeline = [
      {
        $match: await this.createMatchStageQuery(report)
      },
      skip
        ? {
            $skip: skip
          }
        : null,
      limit
        ? {
            $limit: limit
          }
        : null
    ].filter(p => p);

    if (!report.data || report.data.length === 0) {
      //   await this.dataService.pushCollections();

      report.data = await this.dataService.aggregate(
        report.entityName,
        pipeline
      );
      report.count = await this.dataService.count(
        report.entityName,
        this.createMatchStageQuery(report)
      );
    }

    return report;
  }

  wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  async onlineAnalyze(
    rawReport: ReportInterface,
    format: ReportFormatInterface
  ) {
    const DateUnitToFormatMap = {
      minute: "YYYY-MM-DD kk:mm",
      hour: "YYYY-MM-DD kk",
      day: "jYYYY/jMM/jDD",
      month: "YYYY-MM",
      year: "YYYY",
      jMonth: "jYYYY/jMM",
      jYear: "jYYYY"
    };

    let aggregation = [];

    if (!format.method) {
      return;
    }

    if (format.method === "aggregate") {
      aggregation = await this.dataService.aggregate(
        rawReport.entityName,
        format.options.pipeline
      );
    }


    if (format.method === "analyze1d") {
      if (!format.options.groupBy || !format.options.valueBy) {
        return;
      }

      aggregation = await this.dataService.aggregate(rawReport.entityName, [
        {
          $match: this.createMatchStageQuery(rawReport)
        },
        {
          $group: {
            _id: "$" + format.options.groupBy.name,
            value: format.options.valueBy.operator
          }
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: "$value"
          }
        }
      ]);

      aggregation = aggregation.map(p => {
        if (!p.name) p.name = "null";
        return p;
      });
    }

    if (format.method === "analyze2d") {
      if (!format.options.valueBy || !format.options.dateBy) {
        return;
      }

      format.options.dateRangeStart = moment(format.options.dateRangeEnd)
        .add(-1 * format.options.dateRangeCount, format.options.dateRangeUnit)
        .toDate();

      const pipeline = [
        {
          $match: this.createMatchStageQuery(rawReport)
        },
        {
          $match: {
            $expr: {
              $lte: [
                {
                  $convert: {
                    input: "$" + format.options.dateBy.name,
                    to: "date"
                  }
                },
                {
                  $convert: { input: format.options.dateRangeEnd, to: "date" }
                }
              ]
            }
          }
        },
        {
          $match: {
            $expr: {
              $gte: [
                {
                  $convert: {
                    input: "$" + format.options.dateBy.name,
                    to: "date"
                  }
                },
                {
                  $convert: { input: format.options.dateRangeStart, to: "date" }
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              ...(format.options.groupBy
                ? { group: "$" + format.options.groupBy.name }
                : {}),
              ...{
                date: {
                  $dateToString: {
                    date: { $toDate: "$" + format.options.dateBy.name },
                    format:
                      format.options.dateRangeUnit === "minute" ||
                      format.options.dateRangeUnit === "hour"
                        ? "%Y-%m-%d %M:%S"
                        : "%Y-%m-%d"
                  }
                }
              }
            },
            value: format.options.valueBy.operator
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id.date",
            group: "$_id.group",
            value: "$value"
          }
        }
      ];

      // console.log(JSON.stringify(pipeline, null, 2));
      aggregation = await this.dataService.aggregate(
        rawReport.entityName,
        pipeline
      );

      const groupBy = _.groupBy(aggregation, p => p.group);

      format.options.dateRangeFormat =
        DateUnitToFormatMap[format.options.dateRangeUnit];

      aggregation = Object.keys(groupBy).map(key => {
        return {
          name: key == "undefined" || !key ? "DATASET" : key,
          series: _.range(format.options.dateRangeCount).map(n => {
            const label = moment(format.options.dateRangeEnd || null)
              .add(
                (format.options.dateRangeCount - n) * -1,
                format.options.dateRangeUnit
              )
              .format(format.options.dateRangeFormat);

            console.log(
              label,
              _.get(
                groupBy[key].find(
                  r =>
                    moment(r.date).format(format.options.dateRangeFormat) ===
                    label
                ),
                "value"
              )
            );
            return {
              name: label,
              value:
                _.get(
                  groupBy[key].find(
                    r =>
                      moment(r.date).format(format.options.dateRangeFormat) ===
                      label
                  ),
                  "value"
                ) || 0
            };
          })
          // groupBy[key].map(p => {
          //   return {
          //     name: p.date,
          //     value: p.value
          //   };
          // })
        };
      });
    }

    const report = _.clone(rawReport);
    report.count = aggregation.length;
    report.data = aggregation;
    report.fields = [];
    for (let i = 0; i < 3; i++) {
      report.fields = await this.dataService.fields(
        report.entityName,
        report,
        1,
        3,
        [],
        true
      );
    }

    return report;
  }
  async offlineAnalyze(report: ReportInterface, format: ReportFormatInterface) {
    if (!this.formatterBusy) {
      this.formatterBusy = true;
      // report = await this.generate(_.omit(report, "data"));

      ["dateBy", "groupBy", "valueBy", "sizeBy"].forEach(optName => {
        if (format.options[optName]) {
          const optField: ReportFieldInterface = format.options[optName];

          if (
            report.fields.filter(p => p.name === optField.name).length === 0
          ) {
            optField.enabled = true;
            report.fields.push(optField);
          }
        }
      });

      // TODO: if for offline reports
      report = await this.getAsyncReportFormatMethods()[format.method]({
        report: await this.generate(report, 0, 0, false),
        format
      });

      this.formatterBusy = false;
      return report;
    } else {
      await this.wait(1000);
      return this.offlineAnalyze(report, format);
    }
  }

  getAsyncReportFormatMethods(): {
    [key: string]: (input: {
      report: ReportInterface;
      format: ReportFormatInterface;
    }) => Promise<ReportInterface>;
  } {
    return {
      javascript: async input => {
        const formatOptions: { code: string } = input.format.options;

        // tslint:disable-next-line:no-eval
        const methodContainer = eval(formatOptions.code);

        const method = methodContainer({ _ });

        return await method(input.report);
      },
      analyze2d: async _input => {
        const _formatOptions: {
          dateBy: ReportFieldInterface;
          groupBy: ReportFieldInterface;
          valueBy: ReportFieldInterface;
          dateRangeCount: number;
          dateRangeFormat: string;
          dateRangeEnd: string;
          dateRangeUnit: moment.JUnitOfTime | moment.unitOfTime.All;
        } = {
          dateBy: _input.format.options.dateBy,
          groupBy: _input.format.options.groupBy,
          valueBy: _input.format.options.valueBy,
          dateRangeUnit: _input.format.options.dateRangeUnit || "minute",
          dateRangeEnd: _input.format.options.dateRangeEnd,
          dateRangeFormat: _input.format.options.dateRangeFormat || "kk-mm",
          dateRangeCount: _input.format.options.dateRangeCount || 10
        };

        _input.report = await this.generate(_input.report, 0, 0);

        const thread = spawn(location.origin + "/workers/analyze/2d.js");

        return new Promise((resolve, reject) => {
          thread
            .send(
              JSON.stringify({
                _input,
                _formatOptions
              })
            )
            .on("message", output => {
              resolve(output);
              thread.kill();
            })
            .on("error", e => {
              reject(e);
            });
        }).catch(e => console.log(e)) as any;
      },
      analyze1d: async _input => {
        const thread = spawn(location.origin + "/workers/analyze/1d.js");
        const _formatOptions: {
          valueBy: ReportFieldInterface;
          groupBy: ReportFieldInterface;
        } = {
          groupBy: _input.format.options.groupBy,
          valueBy: _input.format.options.valueBy
        };
        return new Promise((resolve, reject) => {
          thread
            .send(
              JSON.stringify({
                _input,
                _formatOptions
              })
            )
            .on("message", output => {
              resolve(output);
              thread.kill();
            })
            .on("error", e => {
              reject(e);
            });
        }).catch(e => console.log(e)) as any;
      }
    };
  }
}
