import { Injectable, Input } from "@angular/core";
import {
  EntityModel,
  ReportFieldInterface,
  FieldQueryInterface,
  ReportInterface,
  ReportFormatInterface
} from "serendip-business-model";
import * as _ from "underscore";
import { DataService } from "./data.service";
import { IdbService } from "./idb.service";
import { WebWorkerService } from "./web-worker.service";
import ObjectID from "bson-objectid";
import { ObService } from "./ob.service";
import * as moment from "moment-jalaali";

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
  ) {}

  async generate(report: ReportInterface) {
    if (!report.fields) {
      report.fields = [];
    }

    if (!report.data) {
      await this.dataService.pushCollections();

      let data = await this.dataService.list(report.entityName, 0, 0, false);
      if (!data) {
        data = [];
      }

      data = await Promise.all(
        data.map((document, index) => {
          return this.formatDocument(document, report.fields);
        })
      );

      const queriedData = [];
      await Promise.all(
        data.map((document, index) => {
          return new Promise(async (resolve, reject) => {
            const isMatch = await this.documentMatchFieldQueries(
              document,
              report.fields
            );

            if (isMatch) {
              queriedData.push(document);
            }
            resolve();
          });
        })
      );

      report.data = queriedData;
      report.count = report.data.length;

      // report.formats = [
      //   {
      //     method: "javascript",
      //     options: {
      //       code: groupMethod.toString()
      //     }
      //   }
      //   // {
      //   //   method : 'groupByQueries',
      //   //   options : {
      //   //     queries : [{method : 'eq',}] as FieldQueryInterface[]
      //   //   }
      //   // }
      // ];
    }

    return report;
  }

  queueFormatReport(): Promise<ReportFormatInterface> {
    return new Promise<ReportFormatInterface>((resolve, reject) => {
      this.formatReportQueue = ObjectID.generate();
    });
  }

  wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  async formatReport(report: ReportInterface, format: ReportFormatInterface) {
    if (!this.formatterBusy) {
      this.formatterBusy = true;
      // report = await this.generate(_.omit(report, "data"));

      console.log(format.method);
      // TODO: if for offline reports
      report = await this.getAsyncReportFormatMethods()[format.method]({
        report: _.clone(report),
        format
      });

      this.formatterBusy = false;
      return report;
    } else {
      await this.wait(1000);
      return this.formatReport(report, format);
    }
  }

  async formatDocument(document: EntityModel, fields: ReportFieldInterface[]) {
    // iterate throw fields in document
    const fieldsToFormat = await Promise.all(
      fields
        .filter(field => {
          return (
            field.enabled && this.getAsyncFieldFormatMethods()[field.method]
          );
        })
        // map each field to get value from
        .map(field => {
          return new Promise(async (resolve, reject) => {
            let value = null;

            // check if field method exists
            value = await this.getAsyncFieldFormatMethods()[field.method]({
              document,
              field
            });

            const fieldToSet = {};
            fieldToSet[field.name] = value;
            resolve(fieldToSet);
          });
        })
    );

    return _.extend(document, ...fieldsToFormat);
  }

  async documentMatchFieldQuery(
    record: EntityModel,
    fields: ReportFieldInterface[],
    field: ReportFieldInterface,
    query: FieldQueryInterface
  ) {
    if (!query.enabled) {
      return true;
    }

    if (!query.methodInput) {
      query.methodInput = {};
    }

    if (this.getSyncFieldQueryMethods()[query.method]) {
      if (!query.methodInput.value) {
        query.methodInput.value = "";
      }
      return this.getSyncFieldQueryMethods()[query.method](
        record[field.name],
        query.methodInput.value
      );
    }
    if (this.getAsyncFieldQueryMethods[query.method]) {
      return await this.getAsyncFieldQueryMethods()[query.method]({
        document: record,
        field,
        query
      });
    } else {
      return false;
    }
  }

  /**
   *
   * @param record Document record to check
   * @param fields Fields to check their queries
   */
  async documentMatchFieldQueries(
    record: EntityModel,
    fields: ReportFieldInterface[]
  ): Promise<boolean> {
    const results = await Promise.all(
      fields.map(async field => {
        if (!field.enabled) {
          return true;
        }
        if (!field.queries) {
          return true;
        }
        return Promise.all(
          field.queries.map(query =>
            this.documentMatchFieldQuery(record, fields, field, query)
          )
        );
      })
    );

    return (
      _.flatten(results).filter(r => {
        return r === false;
      }).length === 0
    );
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

        //    try {
        return await method(input.report);
        // } catch (error) {
        //   return input.report;
        // }
      },
      analyze2d: async input => {
        const formatOptions: {
          dateBy: ReportFieldInterface;
          groupBy: ReportFieldInterface;
          dateRangeCount: number;
          dateRangeUnit: moment.JUnitOfTime | moment.unitOfTime.All;
        } = {
          dateBy: input.format.options.countBy,
          groupBy: input.format.options.groupBy,
          dateRangeUnit: input.format.options.dateRangeUnit || "minute",
          dateRangeCount: input.format.options.dateRangeCount || 30
        };

        const r = input.report;
        let dataGroups: { [key: string]: EntityModel[] } = {};
        // if (formatOptions.groupBy.name.indexOf("date") !== -1) {
        //   r.data = _.groupBy(r.data, p =>
        //     moment(p[formatOptions.groupBy.name]).format("YYYY-MM-DD")
        //   ) as any;
        // } else {

        // }

        if (!formatOptions.groupBy) {
          dataGroups = { all: r.data } as any;
        } else {
          dataGroups = _.groupBy(r.data, p =>
            p[formatOptions.groupBy.name] === "undefined"
              ? "n/a"
              : p[formatOptions.groupBy.name] || "n/a"
          ) as any;
        }

        console.log(dataGroups);

        r.data = [];

        for (const groupKey in dataGroups) {
          // group["n/a"] =
          //   [...(group[""] || []), ...(group["undefined"] || [])] || [];
          // delete group[""];
          // delete group["undefined"];
          const dataGroup = dataGroups[groupKey];

          const series = [];

          let dateRangeFormat = "YYYY-MM-DD";

          if (formatOptions.dateRangeUnit === "minute") {
            dateRangeFormat = "kk-mm";
          }

          if (formatOptions.dateRangeUnit === "hour") {
            dateRangeFormat = "kk";
          }

          if (formatOptions.dateRangeUnit === "month") {
            dateRangeFormat = "YYYY-MM";
          }

          if (formatOptions.dateRangeUnit === "year") {
            dateRangeFormat = "YYYY-MM";
          }

          if (formatOptions.dateRangeUnit === "jMonth") {
            dateRangeFormat = "jYYYY-jMM";
          }

          if (formatOptions.dateRangeUnit === "jYear") {
            dateRangeFormat = "jYYYY";
          }

          const timeRanges = _.range(formatOptions.dateRangeCount).map(n => {
            return moment()
              .add(
                (n - formatOptions.dateRangeCount) as any,
                formatOptions.dateRangeUnit
              )
              .format(dateRangeFormat);
          });

          let count = 0;
          // tslint:disable-next-line:forin
          for (const timeRange of timeRanges) {
            for (const row of dataGroup) {
              if (
                moment(
                  row[
                    formatOptions.dateBy ? formatOptions.dateBy.name : "_vdate"
                  ]
                ).format(dateRangeFormat) === timeRange
              ) {
                count++;
              }
            }

            series.push({
              name: timeRange,
              value: count
            });
          }

          r.data.push({
            name: groupKey,
            series
          });
        }

        r.fields = [
          {
            label: formatOptions.groupBy ? formatOptions.groupBy.label : "all",
            name: "name",
            enabled: true
          },
          { label: "تعداد", name: "series", enabled: true }
        ];
        r.count = r.data.length;

        console.log(r.data);

        //        r.data = r.data.sort((a, b) => b.value - a.value);
        return r;
      },
      analyze1d: async input => {
        const formatOptions: { groupBy: ReportFieldInterface } = {
          groupBy: input.format.options.groupBy
        };
        const r = input.report;

        r.data = _.groupBy(r.data, p => p[formatOptions.groupBy.name]) as any;

        r.data["n/a"] =
          [...(r.data[""] || []), ...(r.data["undefined"] || [])] || [];
        delete r.data[""];
        delete r.data["undefined"];
        r.data = Object.keys(r.data).map(p => {
          return {
            name: p,
            value: r.data[p].length || 0
            //   data: r.data[p] || []
          };
        });
        r.fields = [
          { label: formatOptions.groupBy.label, name: "name", enabled: true },
          { label: "تعداد", name: "value", enabled: true }
        ];
        r.count = r.data.length;
        r.data = r.data.sort((a, b) => b.value - a.value);
        return r;
      }
    };
  }
  /**
   * will return al async field formatting method available. each method takes document and field as input and return value to set on field
   */
  getAsyncFieldFormatMethods(): {
    [key: string]: (input: {
      document: EntityModel;
      field: ReportFieldInterface;
    }) => Promise<any>;
  } {
    return {
      findEntityById: async input => {
        const methodOptions: { entity: string } = input.field.methodOptions;

        return await this.dataService.details(
          methodOptions.entity,
          input.document[input.field.name]
        );
      },
      findEntitiesById: async input => {
        const methodOptions: { entity: string } = input.field.methodOptions;

        return await this.dataService.details(
          methodOptions.entity,
          input.document[input.field.name]
        );
      },
      joinFields: async input => {
        const methodOptions: { fields: string[]; separator: string } =
          input.field.methodOptions;

        return _.map(methodOptions.fields, f => input.document[f]).join(
          methodOptions.separator
        );
      },
      javascript: async input => {
        const methodOptions = { code: input.field.methodOptions.code };

        let evaluatedCode;
        try {
          // tslint:disable-next-line:no-eval
          evaluatedCode = eval(methodOptions.code);
          if (typeof evaluatedCode !== "function") {
            return "evaluated code is not a function";
          }
        } catch (error) {
          return error.message || error;
        }
      }
    };
  }

  getAsyncFieldQueryMethods(): {
    [key: string]: (opts: {
      document: EntityModel;
      field: ReportFieldInterface;
      query: FieldQueryInterface;
    }) => Promise<boolean>;
  } {
    return {
      javascript: async opts => {
        return true;
      }
    };
  }

  getSyncFieldQueryMethods(): {
    [key: string]: (value: any, input: any) => boolean;
  } {
    return {
      eq: (value, input) => {
        return value === input;
      },

      neq: (value, input) => {
        return value !== input;
      },

      gt: (value, input) => {
        return value < input;
      },

      gte: (value, input) => {
        return value <= input;
      },

      lt: (value, input) => {
        return value > input;
      },

      lte: (value, input) => {
        return value >= input;
      },

      nin: (value, input) => {
        if (!value.indexOf) {
          return false;
        }
        return value.indexOf(input) === -1;
      },
      inDateRange: (value, input) => {
        value = new Date(value).getTime();

        const from = new Date(input.from).getTime();
        const to = new Date(input.to).getTime();

        if (from && to) {
          return (
            (value >= from && value <= to) || (value >= to && value <= from)
          );
        }

        if (from) {
          return value >= from;
        }

        if (to) {
          return value <= to;
        }

        return false;
      },
      in: (value, input) => {
        if (!value.indexOf) {
          return false;
        }
        return value.indexOf(input) !== -1;
      }
    };
  }
}
