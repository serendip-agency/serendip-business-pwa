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
    moment.loadPersian();
  }

  async generate(report: ReportInterface) {
    if (!report) {
      return;
    }
    if (!report.fields) {
      report.fields = [];
    }

    if (!report.data || report.data.length === 0) {
      await this.dataService.pushCollections();

      console.log("generate report", report);
      let data = await this.dataService.list(report.entityName, 0, 0);
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
        report: await this.generate(report),
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

        const thread = spawn(location.origin + "/workers/analyze2d.js");

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
        const thread = spawn(location.origin + "/workers/analyze1d.js");
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
        const methodOptions: {
          entityName: string;
          field: ReportFieldInterface;
        } = input.field.methodOptions;

        let model;

        try {
          model = await this.dataService.details(
            methodOptions.entityName,
            input.document[input.field.name.split(".")[0]]
          );
        } catch (error) {}

        if (model) {
          if (methodOptions.field) {
            return model[methodOptions.field.name];
          }

          return model;
        }

        return null;
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

          return evaluatedCode(input.document, input.field);
        } catch (error) {
          console.log(error);
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
