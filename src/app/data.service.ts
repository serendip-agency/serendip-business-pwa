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
  public static collectionsSynced: string[] = [];
  public static collectionsToSync: string[] = ["company", "people"];
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

        console.log(
          "HTTP " + opts.method.toUpperCase() + " Request to",
          opts.host,
          opts.path
        );

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

      if (opts.modelName) {
        this.obService.publish(opts.modelName, result);
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
      const data = await store.get(controller);
      return _.take(_.rest(data, skip), limit);
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

  async reports(entityName: string) {
    return this.request({
      path: "/api/entity/reports",
      model: { entityName },
      method: "POST",
      timeout: 1000,
      retry: false
    });
  }
  async report<A>(opts: {
    entity: string;
    skip?: number;
    limit?: number;
    zip?: boolean;
    save?: boolean;
    report: ReportInterface;
  }): Promise<ReportModel> {
    const requestOpts: DataRequestInterface = {
      method: "POST",
      path: `/api/entity/report`,
      model: opts,
      timeout: 3000
    };

    if (opts.zip) {
      requestOpts.raw = true;
    }

    try {
      const requestResult = await this.request(requestOpts);

      if (opts.zip) {
        const data = requestResult.body;
        if (!data) {
          return null;
        }

        const zip = await JsZip.loadAsync(data, {
          base64: false,
          checkCRC32: true
        });

        const unzippedText: any = await zip.file("data.json").async("text");

        const unzippedArray = JSON.parse(unzippedText);

        return unzippedArray;
      } else {
        return requestResult;
      }
    } catch (error) {

      return {
        fields: opts.report.fields,
        count: await this.count(opts.entity, true),
        name: "",
        label: "گزارش پیش‌فرض آنلاین",
        createDate: new Date(),
        data: await this.list(opts.entity, 0, 0, true),
        entityName: opts.entity,
        offline: true
      };
    }
  }

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

      return _.findWhere(data, { _id: _id });
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
    from: number,
    to: number,
    _id?: string
  ): Promise<any> {
    const model = {
      _id: _id,
      from: from,
      to: to
    };

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/changes`,
      timeout: 1000,
      model: model
    });
  }

  async insert<A>(
    controller: string,
    model: A,
    modelName?: string
  ): Promise<A> {
    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/insert`,
      timeout: 1000,
      model: model,
      modelName: modelName,
      retry: true
    });
  }

  async update<A>(
    controller: string,
    model: A,
    modelName?: string
  ): Promise<A> {
    // const store = await this.idbService.dataIDB(controller);
    // store.set((model as any)._id, model);

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/update`,
      model: model,
      modelName: modelName,
      retry: true
    });
  }

  delete<A>(controller: string, _id: string): Promise<A> {
    const model = { _id: _id };

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/delete`,
      model: model,
      retry: true
    });
  }

  public async pullCollection(collection) {
    console.warn("pulling collection", collection);
    const pullStore = await this.idbService.syncIDB("pull");

    let lastSync: number;

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
      console.warn(
        "last sync of " +
          collection +
          " was " +
          (Date.now() - lastSync) / 1000 +
          "ms"
      );
    }

    const store = await this.idbService.dataIDB();
    let changesToSync;

    if (lastSync) {
      changesToSync = await this.changes(collection, lastSync, Date.now());

      console.warn("changes to sync for " + collection, changesToSync);
      if (changesToSync.deleted.length > 0) {
        await Promise.all(
          changesToSync.deleted.map(key => {
            return store.delete(key);
          })
        );
      }
    }

    console.warn("downloading zip for " + collection);
    const data = await this.zip(collection, lastSync, Date.now());

    // data = _.map(data, (record: any) => {
    //   return { key: record._id, val: record };
    // });
    console.warn(
      "zip extracted. it contain " +
        data.length +
        " record, starting to add ..."
    );
    //   await store.setAll(data as any);
    await store.set(collection, data);

    await pullStore.set(collection + "_" + Date.now(), {
      events: changesToSync
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
    console.log("pull started");
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

    console.warn(collections);

    await promiseSerial(
      _.map(collections, collection => {
        return () => {
          return this.pullCollection(collection);
        };
      }),
      { parallelize: 16 }
    );
  }

  public async sync(opts: { onCollectionSync?: Function }) {
    console.log("push start");
    try {
      await this.pushCollections();
      console.log("push done");
    } catch (error) {
      console.log("push fail");
    }

    console.log("pull start");
    try {
      await this.pullCollections();
      console.log("pull done");
    } catch (error) {
      console.log("pull fail");
    }
  }
}
