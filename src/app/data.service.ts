import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as JsZip from "jszip";
import { ReportInterface, ReportModel } from "serendip-business-model";
import * as utils from "serendip-utility";
import * as _ from "underscore";

import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { BusinessService } from "./business.service";
import { IdbService } from "./idb.service";
import { ObService } from "./ob.service";
import * as promiseSerial from "promise-serial";
import { FormsSchema, ReportsSchema } from "./schema";
import { DocumentIndex } from "ndx";
import { SearchSchema } from "./schema/search";
export interface DataRequestInterface {
  method: string | "POST" | "GET";
  path: string;
  model?: any;
  raw?: boolean;
  retry?: boolean;
  host?: string;
  modelName?: string;

  timeout?: number;
}

@Injectable()
export class DataService {
  // public collectionsTextIndex: DocumentIndex[];

  collectionsTextIndexCache: { [key: string]: any } = {};
  public static collectionsSynced: string[] = [];
  public static collectionsToSync: string[] = ["company", "people"];
  commonEnglishWordsIndexCache: any;
  constructor(
    private obService: ObService,
    private http: HttpClient,
    private authService: AuthService,
    private idbService: IdbService,
    private snackBar: MatSnackBar,
    private businessService: BusinessService
  ) {}

  private async requestError(opts: DataRequestInterface, error) {
    if (error.status === 401) {
      this.authService.logout();
    }

    console.error(error, opts);
  }

  public request(opts: DataRequestInterface): Promise<any> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        reject("timeout");
      }, opts.timeout || 10000);

      opts.method = opts.method.trim().toUpperCase();

      let result = {};

      if (!opts.model) {
        opts.model = {};
      }

      if (!opts.host) {
        opts.host = environment.api;
      }

      try {
        const token = await this.authService.token();

        if (!opts.model._business) {
          if (this.businessService.getActiveBusinessId()) {
            opts.model._business = this.businessService.getActiveBusinessId();
          } else {
            throw new Error("no business set");
          }
        }

        const options: any = {
          headers: {
            Authorization: "Bearer " + token.access_token,
            clientid: environment.clientId
          }
        };

        if (opts.raw) {
          options.responseType = "blob";
          options.observe = "response";
        }

        // console.log(
        //   "HTTP " + opts.method.toUpperCase() + " Request to",
        //   opts.host + opts.path
        // );

        if (opts.method.toUpperCase() === "POST") {
          result = await this.http
            .post(opts.host + opts.path, opts.model, options)
            .toPromise();
        }

        if (opts.method.toUpperCase() === "GET") {
          result = await this.http
            .get(
              opts.host +
                opts.path +
                "?" +
                utils.querystring.fromObject(opts.model),
              options
            )
            .toPromise();
        }
      } catch (error) {
        await this.requestError(opts, error);
        throw error;
      }

      resolve(result);
    });
  }

  public async zip<A>(
    controller: string,
    from?: number,
    to?: number
  ): Promise<A[]> {
    const res: any = await this.request({
      method: "POST",
      path: `/api/entity/${controller}/zip`,
      model: {
        from: from,
        to: to
      },
      raw: true
    });

    const data = res.body;
    if (!data) {
      return [];
    }

    const zip = await JsZip.loadAsync(data, {
      base64: false,
      checkCRC32: true
    });

    const unzippedText: any = await zip.file("data.json").async("text");

    const unzippedArray = JSON.parse(unzippedText);

    return unzippedArray;
  }

  async list<A>(
    controller: string,
    skip,
    limit,
    offline?: boolean
  ): Promise<any> {
    if (DataService.collectionsSynced.indexOf(controller) !== -1 || offline) {
      const storeName = controller.toLowerCase().trim();
      const store = await this.idbService.dataIDB();
      let data = await store.get(controller);

      if (!data) {
        data = [];
      } else {
        data = Object.values(data);
      }

      if (skip && limit) {
        return _.take(_.rest(data, skip), limit);
      }

      if (!skip && limit) {
        return _.take(data, limit);
      }

      if (skip && !limit) {
        return _.rest(data, skip);
      }

      return data;
    } else {
      try {
        return this.request({
          method: "POST",
          path: `/api/entity/${controller}/list`,
          timeout: 1000,
          model: {
            skip: skip,
            limit: limit
          }
        });
      } catch (error) {
        if (!offline) {
          return await this.list(controller, skip, limit, true);
        }
      }
    }
  }

  async cacheReport(reportId: string) {
    const reportStore = await this.idbService.reportIDB();
    await reportStore.set(
      reportId,
      await this.request({
        method: "POST",
        path: `/api/entity/report`,
        model: {
          reportId: reportId,
          zip: true
        }
      })
    );
  }

  // async report<A>(opts: reportOptionsInterface): Promise<ReportModel> {
  //   if (!opts.online) {
  //     return this.offlineReport(opts);
  //   }

  //   const requestOpts: DataRequestInterface = {
  //     method: "POST",
  //     path: `/api/entity/report`,
  //     model: opts,
  //     timeout: 3000
  //   };

  //   if (opts.zip) {
  //     requestOpts.raw = true;
  //   }

  //   try {
  //     const requestResult = await this.request(requestOpts);

  //     if (opts.zip) {
  //       const data = requestResult.body;
  //       if (!data) {
  //         return null;
  //       }

  //       const zip = await JsZip.loadAsync(data, {
  //         base64: false,
  //         checkCRC32: true
  //       });

  //       const unzippedText: any = await zip.file("data.json").async("text");

  //       const unzippedArray = JSON.parse(unzippedText);

  //       return unzippedArray;
  //     } else {
  //       return requestResult;
  //     }
  //   } catch (error) {
  //     return await this.offlineReport(opts);
  //   }
  // }

  async search<A>(
    controller: string,
    query: string,
    take: number,
    properties: string[],
    propertiesSearchMode: string,
    offline?: boolean
  ): Promise<any> {
    if (DataService.collectionsSynced.indexOf(controller) !== -1 || offline) {
      const storeName = controller.toLowerCase().trim();

      const store = await this.idbService.dataIDB();
      const data = await store.get(controller);
      const result = [];

      await Promise.all(
        _.map(data, model => {
          return new Promise(async (resolve, reject) => {
            const modelText = JSON.stringify(model);
            if (modelText.indexOf(query) !== -1) {
              result.push(model);
            }

            resolve();
          });
        })
      );

      return _.take(result, take);
    } else {
      try {
        return await this.request({
          method: "POST",
          path: `/api/entity/${controller}/search`,
          model: {
            properties,
            propertiesSearchMode,
            take: take,
            query: query
          },
          timeout: 1000,
          retry: false
        });
      } catch (error) {
        if (!offline) {
          return await this.search(
            controller,
            query,
            take,
            properties,
            propertiesSearchMode,
            true
          );
        } else {
          throw error;
        }
      }
    }
  }

  async count(controller: string, offline?: boolean): Promise<number> {
    if (DataService.collectionsSynced.indexOf(controller) !== -1 || offline) {
      const store = await this.idbService.dataIDB();
      const data = await store.get(controller);

      return data.length;
    } else {
      try {
        return this.request({
          method: "POST",
          timeout: 1000,
          path: `/api/entity/${controller}/count`
        });
      } catch (error) {
        if (!offline) {
          return await this.count(controller, true);
        }
      }
    }
  }

  async details<A>(
    controller: string,
    _id: string,
    offline?: boolean
  ): Promise<A> {
    if (DataService.collectionsSynced.indexOf(controller) !== -1 || offline) {
      const store = await this.idbService.dataIDB();
      const data = await store.get(controller);
      return data[_id];
    } else {
      try {
        return this.request({
          method: "POST",
          timeout: 1000,
          path: `/api/entity/${controller}/details`,
          model: { _id }
        });
      } catch (error) {
        if (!offline) {
          return await this.details<A>(controller, _id, true);
        }
      }
    }
  }

  changes(
    controller: string,
    from?: number,
    to?: number,
    _id?: string
  ): Promise<any> {
    const query = {
      _id,
      "model._entity": controller,
      "model._vdate": { $gt: from || 0, $lt: to || Date.now() }
    };

    return this.request({
      method: "POST",
      path: `/api/entity/changes`,
      timeout: 1000,
      model: query
    });
  }

  countChanges(
    controller: string,
    from?: number,
    to?: number,
    _id?: string
  ): Promise<any> {
    const query = {
      _id,
      "model._entity": controller,
      "model._vdate": { $gt: from || 0, $lt: to || Date.now() },
      count: true
    };

    return this.request({
      method: "POST",
      path: `/api/entity/changes`,
      timeout: 1000,
      model: query
    });
  }

  async insert(
    controller: string,
    model: any,
    modelName?: string
  ): Promise<any> {
    let result = await this.request({
      method: "POST",
      path: `/api/entity/${controller}/insert`,
      timeout: 1000,
      model: model,
      modelName: modelName,
      retry: true
    });

    if (result._id) {
      const store = await this.idbService.dataIDB();
      let data = await store.get(controller);
      data[result._id] = result;
      await store.set(controller, data);

      this.obService.publish(controller, "create", result);
    }

    return result;
  }

  async update(
    controller: string,
    model: any,
    modelName?: string
  ): Promise<any> {
    const store = await this.idbService.dataIDB();
    let data = await store.get(controller);

    if (model._id) {
      data[model._id] = model;
      await store.set(controller, data);
    }

    this.obService.publish(controller, "update", model);

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/update`,
      model: model,
      modelName: modelName,
      retry: true
    });
  }

  async delete<A>(controller: string, _id: string): Promise<A> {
    const model = { _id: _id };

    if (_id) {
      const store = await this.idbService.dataIDB();

      let data = await store.get(controller);
      delete data[_id];
      await store.set(controller, data);

      this.obService.publish(controller, "delete", model);
    }

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/delete`,
      model: model,
      retry: true
    });
  }

  public async pullCollection(collection) {
    const pullStore = await this.idbService.syncIDB("pull");

    let lastSync = 0;

    try {
      const syncKeys = _.filter(await pullStore.keys(), (item: string) => {
        return item.toString().indexOf(collection + "_") === 0;
      }).reverse();

      if (syncKeys && syncKeys.length > 0) {
        // tslint:disable-next-line:radix
        lastSync = parseInt(syncKeys[0].split("_")[1]);
      }
    } catch (e) {
      console.log(e);
    }

    if (lastSync) {
      // TODO Delete removed items
    }

    const store = await this.idbService.dataIDB();
    let changes;
    let changesCount;

    changesCount = await this.countChanges(collection, lastSync, Date.now());

    if (!changesCount) {
      return;
    }

    let currentData = await store.get(collection);
    if (!currentData) {
      currentData = {};
    }

    changes = await this.changes(collection, lastSync, Date.now());

    if (changes) {
      if (changes.deleted.length > 0) {
        changes.deleted.forEach(key => {
          delete currentData[key];
        });
      }
    }

    console.warn(
      "changes count for " +
        collection +
        " is " +
        changesCount +
        " since " +
        lastSync,
      changes
    );

    const newData = await this.zip(collection, lastSync, Date.now());
    currentData = _.extend(currentData, newData);

    await store.set(collection, currentData);

    await pullStore.set(collection + "_" + Date.now(), {
      events: changes
    });
  }

  public pushCollections() {
    return new Promise(async (resolve, reject) => {
      const store = await this.idbService.syncIDB("push");
      const keys = await store.keys();

      const pushes = _.map(keys, key => {
        return {
          key: key,
          promise: new Promise(async (_resolve, _reject) => {
            const pushModel = await store.get(key);
            await this.request(pushModel.opts);
            _resolve();
          })
        };
      });

      const runInSeries = index => {
        const pushModel: any = pushes[index];
        pushModel.promise
          .then(() => {
            store.delete(pushModel.key);
            index++;

            if (index === pushes.length) {
              resolve();
            } else {
              runInSeries(index);
            }
          })
          .catch(e => {
            reject();
          });
      };

      if (pushes.length > 0) {
        runInSeries(0);
      } else {
        resolve();
      }
    });
  }

  public async pullCollections(onCollectionSync?: Function) {
    const collections = [];
    FormsSchema.forEach(schema => {
      if (schema.entityName) {
        if (collections.indexOf(schema.entityName) === -1) {
          collections.push(schema.entityName);
        }
      }
    });
    ReportsSchema.forEach(schema => {
      if (schema.entityName) {
        if (collections.indexOf(schema.entityName) === -1) {
          collections.push(schema.entityName);
        }
      }
    });

    await promiseSerial(
      _.map(collections, collection => {
        return () => {
          return this.pullCollection(collection);
        };
      }),
      { parallelize: 16 }
    );

    DataService.collectionsSynced = collections;
  }

  public async indexCollections() {
    await Promise.all(
      SearchSchema.map(schema => {
        return new Promise(async (resolve, reject) => {
          const docIndex = new DocumentIndex({
            filter: str => {
              return str;
            }
          });
          const docs: any[] = await this.list(schema.entityName, 0, 0, true);

          schema.fields.forEach(field => {
            docIndex.addField(field.name, field.opts);
          });

          const alphabets = {
            ا: [],
            ب: [],
            پ: [],
            ت: [],
            ث: [],
            ج: [],
            چ: [],
            ح: [],
            خ: [],
            د: [],
            ذ: [],
            ر: [],
            ز: [],
            ژ: [],
            س: [],
            ش: [],
            ص: [],
            ض: [],
            ط: [],
            ظ: [],
            ع: [],
            غ: [],
            ف: [],
            ق: [],
            ک: [],
            گ: [],
            ل: [],
            م: [],
            ن: [],
            و: [],
            ه: [],
            ی: []
          };

          Object.keys(alphabets).forEach(k => {});

          docs.forEach(doc => {
            docIndex.add(doc._id, doc);
          });

          this.collectionsTextIndexCache[schema.entityName] = docIndex;

          resolve();
        });
      })
    );
  }

  public async indexCommonEnglishWords() {
    const words =
      (await this.http
        .get<string[]>("assets/data/common-words.json")
        .toPromise()) || [];

    const docIndex = new DocumentIndex();

    docIndex.addField("value");

    words.forEach(w => {
      docIndex.add(w, { value: w });
    });

    this.commonEnglishWordsIndexCache = docIndex;
  }
  public async sync() {
    await this.pushCollections();

    await this.pullCollections();

    await this.indexCollections();

    await this.indexCommonEnglishWords();
  }
}
