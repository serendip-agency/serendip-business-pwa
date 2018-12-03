import { Injectable } from "@angular/core";
import {
  EntityModel,
  ReportFieldInterface,
  FieldQueryInterface,
  ReportModel,
  ReportInterface
} from "serendip-business-model";
import * as _ from "underscore";
import { DataService } from "./data.service";
import { IdbService } from "./idb.service";
import { WebWorkerService } from "./web-worker.service";

export interface reportOptionsInterface {
  entity: string;
  skip?: number;
  limit?: number;
  zip?: boolean;
  save?: boolean;
  report: ReportInterface;
  online?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(
    private dataService: DataService,
    private idbService: IdbService,
    private webWorker: WebWorkerService
  ) {}

  async reports(entityName: string) {
    let onlineReports: reportOptionsInterface[] = [];
    let offlineReports: reportOptionsInterface[] = [];
    try {
      onlineReports = await this.dataService.request({
        path: "/api/entity/reports",
        model: { entityName },
        method: "POST",
        timeout: 1000,
        retry: false
      });
    } catch (error) {}

    try {
      offlineReports = await (await this.idbService.reportIDB()).getAll();
    } catch (error) {}
  }

  async generate(opts: reportOptionsInterface) {
    const reportFields: ReportFieldInterface[] = opts.report.fields || [];
    let model: ReportModel = null;
    if (opts.report._id) {
    }

    let data = await this.dataService.list(opts.entity, 0, 0, true);
    if (!data) data = [];

    data = await Promise.all(
      data.map((document, index) => {
        return this.formatDocument(document, reportFields);
      })
    );


    const queriedData = [];
    await Promise.all(
      data.map((document, index) => {
        return new Promise(async (resolve, reject) => {
          const isMatch = await this.documentMatchFieldQueries(
            document,
            reportFields
          );
          if (isMatch) {
            queriedData.push(document);
          }
          resolve();
        });
      })
    );

    model = {
      entityName: opts.report.entityName,
      name: opts.report.name,
      count: queriedData.length,
      data: queriedData,
      fields: reportFields,
      createDate: new Date(),
      label: opts.report.label
    };

    if (opts.save) {
      //   model = (await this.idbService.reportIDB()).(model);
    }

    let result = _.rest(model.data, opts.skip);

    if (opts.limit) {
      result = _.take(result, opts.limit);
    }

    model.data = result;

    return model;
  }
  async formatDocument(document: EntityModel, fields: ReportFieldInterface[]) {
    const fieldsToFormat = await Promise.all(
      fields
        .filter(item => {
          return item.name.indexOf("__") === 0 && item.enabled;
        })
        .map(field => {
          return new Promise(async (resolve, reject) => {
            let value = null;

            if (this.displayFormats()[field.method]) {
              value = await this.displayFormats()[field.method](
                document,
                field.methodOptions,
                field
              );
            } else {
              value = field.method + " not found.";
            }

            const fieldToSet = {};
            fieldToSet[field.name] = value;
            resolve(fieldToSet);
          });
        })
    );

    return _.extend(document, ...fieldsToFormat);
  }

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
          field.queries.map(query => {
            return new Promise(async (resolve, reject) => {
              if (!query.enabled) {
                return resolve(true);
              }

              if (!query.methodInput) {
                query.methodInput = {};
              }

              if (this.syncQueries()[query.method]) {
                if (!query.methodInput.value) {
                  query.methodInput.value = "";
                }
                return resolve(
                  this.syncQueries()[query.method](
                    record[field.name],
                    query.methodInput.value
                  )
                );
              }
              if (this.asyncQueries[query.method]) {
                return resolve(
                  await this.asyncQueries()[query.method](record, query)
                );
              } else {
                resolve(false);
                console.error("query-method-notfound", query);
              }
            });
          })
        );
      })
    );

    return (
      _.flatten(results).filter(r => {
        return r === false;
      }).length === 0
    );
  }

  displayFormats(): {
    [key: string]: (
      record: any,
      options: any,
      field: ReportFieldInterface
    ) => Promise<any>;
  } {
    return {
      joinFields: async (
        record: any,
        opts: { fields: string[]; seperator: string },
        field
      ) => {
        return _.map(opts.fields, field => record[field]).join(opts.seperator);
      }
    };
  }

  asyncQueries(): {
    [key: string]: (
      record: any,
      query: FieldQueryInterface
    ) => Promise<boolean>;
  } {
    return {};
  }

  syncQueries(): {
    [key: string]: (input1: any, input2: any) => boolean;
  } {
    return {
      eq: (input1, input2) => {
        return input1 === input2;
      },

      neq: (input1, input2) => {
        return input1 !== input2;
      },

      gt: (input1, input2) => {
        return input1 < input2;
      },

      gte: (input1, input2) => {
        return input1 <= input2;
      },

      lt: (input1, input2) => {
        return input1 > input2;
      },

      lte: (input1, input2) => {
        return input1 >= input2;
      },

      nin: (input1, input2) => {
        if (!input1.indexOf) {
          return false;
        }
        return input1.indexOf(input2) === -1;
      },

      in: (input1, input2) => {
        if (!input1.indexOf) {
          return false;
        }
        return input1.indexOf(input2) !== -1;
      }
    };
  }
}
