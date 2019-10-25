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

  async generate(report: ReportInterface, skip: number = 0, limit: number = 0) {
    if (!report) {
      return;
    }
    if (!report.fields) {
      report.fields = [];
    }

    if (!report.data || report.data.length === 0) {
      //   await this.dataService.pushCollections();

      report.data = await this.dataService.list(report.entityName, skip, limit);
      report.count = await this.dataService.count(report.entityName);
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
