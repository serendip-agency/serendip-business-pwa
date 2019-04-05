import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as JsZip from "jszip";
import {
  ReportInterface,
  EntityModel,
  ProfileModel
} from "serendip-business-model";
import * as utils from "serendip-utility";
import * as _ from "underscore";

import { AuthService } from "./auth.service";
import { BusinessService } from "./business.service";
import { IdbService } from "./idb.service";
import { ObService } from "./ob.service";
import * as promiseSerial from "promise-serial";
import { FormsSchema, ReportsSchema } from "./schema";
import { createIndex, addDocumentToIndex } from "ndx";
import { SearchSchema } from "./schema/search";
import ObjectID from "bson-objectid";
import * as moment from "moment-jalaali";
import * as aesjs from "aes-js";
import { words } from "lodash";
import { query as ndxQuery } from "ndx-query";
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

  commonEnglishWordsIndexCache: any;

  serversToSelect = [
    { label: "سرور ایران", value: "https://business.serendip.ir" },
    { label: "سرور ابری آلمان", value: "https://business.serendip.cloud" },
    { label: "سرور باکس سرندیپ", value: "box" },
    { label: "سرور توسعه کلاد", value: "http://dev.serendip.cloud:2040" },
    { label: "سرور توسعه محلی", value: "http://localhost:2040" }
  ];

  currentServer = "localhost:2040";
  _fieldsCache: any = {};

  constructor(
    private obService: ObService,
    private authService: AuthService,
    private http: HttpClient,
    private idbService: IdbService,
    private snackBar: MatSnackBar,
    private businessService: BusinessService
  ) {
    this.setCurrentServer();
  }

  async loadBusiness() {
    try {
      const myBusinesses = await this.request({
        method: "get",
        timeout: 3000,
        retry: false,
        path: "/api/business/list"
      });

      this.businessService.business = _.findWhere(myBusinesses, {
        _id: this.businessService.getActiveBusinessId()
      });
    } catch (error) {}
  }
  setCurrentServer(srv?) {
    let lsServer = localStorage.server;

    if (lsServer) {
      if (this.serversToSelect.filter(p => p.value === lsServer).length === 0) {
        lsServer = null;
      }
    }

    if (srv) {
      lsServer = srv;
    } else {
      if (!lsServer || (lsServer.indexOf && lsServer.indexOf("http") !== 0)) {
        switch (location.hostname) {
          case "serendip.ir":
            lsServer = "https://business.serendip.ir";
            break;
          case "localhost":
            lsServer = "http://localhost:2040";
            break;
          default:
            lsServer = "https://business.serendip.cloud";
            break;
        }
      }
    }

    localStorage.setItem("server", lsServer);
    this.currentServer = lsServer;
  }

  async profile(): Promise<ProfileModel> {
    let profileLs = localStorage.getItem("profile");

    try {
      const res = await this.request({ path: "/api/profile", method: "get" });
      if (res) {
        profileLs = res;
        localStorage.setItem("profile", JSON.stringify(profileLs));
      }
    } catch (error) {
      if (profileLs) {
        return JSON.parse(profileLs);
      } else {
        throw error;
      }
    }
  }
  public request(opts: DataRequestInterface): Promise<any> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        reject("timeout");
      }, opts.timeout || 30000);

      opts.method = opts.method.trim().toUpperCase();

      let result = {};

      if (!opts.model) {
        opts.model = {};
      }

      if (!opts.host) {
        opts.host = this.currentServer;
      }

      try {
        const token = await this.authService.token();

        if (!opts.model._business) {
          if (this.businessService.getActiveBusinessId()) {
            opts.model._business = this.businessService.getActiveBusinessId();
          }
        }

        const options: any = {
          headers: {
            Authorization: "Bearer " + token.access_token
            // clientid: environment.clientId
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
        console.warn("request error", opts, error);
        if (error.status === 401) {
          this.authService.logout();
        }

        if (opts.retry) {
          // TODO: add request to push collection

          const pushIdb = await this.idbService.syncIDB("push");

          pushIdb.set(new ObjectID().str, opts);
          return resolve();
        } else {
          return reject(error);
        }
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
      timeout: 60000,
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

  public async export(from?: number, to?: number): Promise<void> {
    const res: any = await this.request({
      method: "POST",
      timeout: 60000,
      path: `/api/entity/export`,
      model: {
        from: from,
        to: to
      },
      raw: true
    });

    const data = res.body;
    if (!data) {
      throw new Error("no data");
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(data);

    fileReader.onload = ev => {
      if ((window as any).cordova) {
        window.open(fileReader.result.toString(), "_system");
      } else {
        this.triggerBrowserDownload(
          fileReader.result,
          "export_" + moment().toISOString() + ".zip"
        );
      }
    };
  }

  triggerBrowserDownload(base64, fileName) {
    const evt = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true
    });
    const a = document.createElement("a");
    a.setAttribute("download", fileName);
    a.setAttribute("href", base64);
    a.setAttribute("target", "_blank");
    a.dispatchEvent(evt);
  }

  async list<A>(
    controller: string,
    skip?,
    limit?,
    offline?: boolean
  ): Promise<EntityModel[]> {
    if (offline) {
      const storeName = controller.toLowerCase().trim();
      const store = await this.idbService.dataIDB();
      let data = (await store.get(controller)) as any;

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
        return (await this.request({
          method: "POST",
          path: `/api/entity/${controller}/list`,
          timeout: 3000,
          retry: false,
          model: {
            skip: skip,
            limit: limit
          }
        })).map(p => this.decrypt(p));
      } catch (error) {
        if (!offline) {
          return await this.list(controller, skip, limit, true);
        }
      }
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
    if (offline) {
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
          timeout: 3000,
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
    if (offline) {
      const store = await this.idbService.dataIDB();

      return store.count();
    } else {
      try {
        return await this.request({
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

  async details(
    controller: string,
    _id: string,
    offline?: boolean,
    error?: any
  ): Promise<EntityModel> {
    if (offline) {
      const store = await this.idbService.dataIDB();

      if (controller) {
        const data = await store.get(controller);
        if (data && data[_id]) {
          return data[_id];
        } else {
          throw error;
        }
      } else {
        throw new Error("not found");
      }
    } else {
      try {
        const result = this.decrypt(
          await this.request({
            method: "POST",

            path: `/api/entity/${controller}/details`,
            model: { _id }
          })
        );

        return result;
      } catch (error) {
        console.log("trying details offline");
        if (!offline) {
          return this.details(controller, _id, true, error);
        } else {
          throw error;
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
      timeout: 60000,
      model: query,
      retry: false
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
      timeout: 60000,
      model: query
    });
  }

  async updateIDB(model: EntityModel, controller: string) {
    let store;
    try {
      store = await this.idbService.dataIDB();
    } catch (error) {}

    if (!store) {
      return;
    }
    let data;

    try {
      data = await store.get(controller);
    } catch (error) {
      return;
    }
    if (!data) {
      data = {};
    }
    data[model._id] = model;

    await store.set(controller, data);
  }

  async insert(controller: string, model: EntityModel): Promise<EntityModel> {
    if (!model._id) {
      model._id = new ObjectID().str;
    }

    await this.request({
      method: "POST",
      path: `/api/entity/${controller}/insert`,
      timeout: 1000,
      model: model,
      retry: true
    });

    await this.updateIDB(model, controller);
    this.obService.publish(controller, "insert", model);

    return model;
  }

  async update(controller: string, model: EntityModel): Promise<EntityModel> {
    if (!model._id) {
      model._id = new ObjectID().str;
    }

    await this.updateIDB(model, controller);

    this.obService.publish(controller, "update", model);

    await this.request({
      method: "POST",
      path: `/api/entity/${controller}/update`,
      model: model,
      retry: true
    });

    return model;
  }

  async delete(controller: string, _id: string): Promise<EntityModel> {
    console.log("delete", controller, _id);

    let model = { _id: _id };

    const store = await this.idbService.dataIDB();

    const data = await store.get(controller);

    if (data) {
      model = _.extend(data[_id] || {});
      delete data[_id];
      await store.set(controller, data);
    }

    this.obService.publish(controller, "delete", model);

    try {
      await this.request({
        method: "POST",
        path: `/api/entity/${controller}/delete`,
        model: { _id },
        retry: true
      });
    } catch (error) {
      console.log("error deleting entity", model, error);
    }

    return model;
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  public async pullCollection(collection) {
    const pullStore = await this.idbService.syncIDB("pull");

    let lastSync = 0;

    const syncKeys = _.filter(await pullStore.keys(), (item: string) => {
      return item.toString().indexOf(collection + "_") === 0;
    }).reverse();

    if (syncKeys && syncKeys.length > 0) {
      // tslint:disable-next-line:radix
      lastSync = parseInt(syncKeys[0].split("_")[1]);
    }
    const dataIdb = await this.idbService.dataIDB();
    let changes;
    let changesCount;

    changesCount = await this.countChanges(collection, lastSync, Date.now());

    if (!changesCount) {
      return;
    }

    // Its and object !
    let currentData = await dataIdb.get(collection);
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

    const newData = await this.zip<EntityModel>(
      collection,
      lastSync,
      Date.now()
    );

    for (const item of newData) {
      currentData[item._id] = this.decrypt(item);
    }

    await dataIdb.set(collection, currentData);

    await pullStore.set(collection + "_" + Date.now(), {
      events: changes
    });
  }
  decrypt(model: EntityModel) {
    if (!model._aes) {
      return model;
    }

    try {
      const aesKey = window.cryptico.decrypt(
        model._aes,
        this.businessService.privateKey
      ).plaintext;

      const dAesCtr = new aesjs.ModeOfOperation.ctr(
        aesjs.utils.utf8.toBytes(aesKey),
        new aesjs.Counter(5)
      );
      const decryptedModel = JSON.parse(
        aesjs.utils.utf8.fromBytes(
          dAesCtr.decrypt(aesjs.utils.hex.toBytes(model._hex))
        )
      );

      delete model["_aes"];
      delete model["_hex"];

      return _.extend(model, decryptedModel);
    } catch (error) {
      console.log(error);
    }

    return model;
  }
  public async pushCollections(callback?: (_id: string, error?: any) => void) {
    const store = await this.idbService.syncIDB("push");
    const pushKeys = await store.keys();

    for (const key of pushKeys) {
      const push = await store.get(key);

      try {
        push.retry = false;
        await this.request(push);
        await store.delete(key);
        if (push && push.model && callback) {
          callback(push.model._id);
        }
      } catch (error) {
        if (push && push.model && callback) {
          callback(push.model._id, error);
        }
      }
    }
  }

  public async pullCollections(
    callback?: (collectionName: string, error?: any) => void
  ) {
    const baseCollections = ["dashboard", "entity", "form", "report"];
    // FormsSchema.forEach(schema => {
    //   if (schema.entityName) {
    //     if (collections.indexOf(schema.entityName) === -1) {
    //       collections.push(schema.entityName);
    //     }
    //   }
    // });
    // ReportsSchema.forEach(schema => {
    //   if (schema.entityName) {
    //     if (collections.indexOf(schema.entityName) === -1) {
    //       collections.push(schema.entityName);
    //     }
    //   }
    // });

    for (const collection of baseCollections) {
      await this.pullCollection(collection);
      callback(collection);
    }

    const entityCollections = (await this.list("entity"))
      .filter(p => p.offline)
      .map(p => p.name);

    for (const collection of entityCollections) {
      await this.pullCollection(collection);
      callback(collection);
    }
  }

  async fields(
    entityName: string,
    report?: ReportInterface,
    depth?: number,
    maxDepth?: number,
    parents?: string[]
  ) {
    if (!parents) {
      parents = [];
    }
    if (depth > maxDepth) {
      return [];
    }

    if (!report) {
      if (this._fieldsCache[`${entityName}`]) {
        return this._fieldsCache[`${entityName}`];
      }
    }

    if (!report) {
      report = _.findWhere(await this.list("report", 0, 0), {
        entityName
      } as ReportInterface);

      if (!report) {
        report = { entityName, fields: [] };
      }
    }

    const primaryFields = JSON.parse(
      JSON.stringify(
        _.findWhere(ReportsSchema, {
          name: "primary"
        }).fields
      )
    );

    primaryFields.forEach(pf => {
      if (report.fields.filter(f => f.name === pf.name).length === 0) {
        report.fields.push(pf);
      }
    });

    for (const row of await this.list(entityName, 0, 10)) {
      for (const key in row) {
        if (
          ["_entity", "_business", "_id", "_vuser", "_uuser"].indexOf(key) !==
          -1
        ) {
          continue;
        }

        const value = row[key];

        if (typeof value === "undefined" || value === null) {
          continue;
        }

        if (
          report.fields.filter(p => p.name === key).length === 0 &&
          report.fields.filter(p => p.name.startsWith(key + ".")).length === 0
        ) {
          if (key.toLowerCase().indexOf("date") !== -1) {
            report.fields.push({
              name: key,
              label: key,
              analytical: true,
              enabled: false,
              type: "date"
            });
            continue;
          }

          if (
            typeof value !== "string" &&
            typeof value.length !== "undefined" &&
            value.length !== 24
          ) {
            // report.fields.push({
            //   name: key + "Length",
            //   label: typeof value === "string" ? "طول " + key : "تعداد " + key,
            //   enabled: false,
            //   analytical: true,
            //   method: "javascript",
            //   methodOptions: {
            //     code: `(async (
            //           document,
            //           field
            //         ) => {
            //           if (document['${key}']) {
            //             return document['${key}'].length;
            //           } else {
            //             return 0;
            //           }
            //         })`.toString()
            //   },
            //   type: "number"
            // });

            report.fields.push({
              name: key,
              label: key,
              analytical: true,
              enabled: false,
              type: "array"
            });

            continue;
          }

          if (typeof value === "string" && value.length === 24) {
            if (value === row._id) {
              continue;
            }
            let model;

            try {
              model = await this.details(null, value);
            } catch (error) {}

            if (model) {
              if (parents.indexOf(model._entity) === -1) {
                (await this.fields(
                  model._entity,
                  null,
                  (depth || 0) + 1,
                  maxDepth === undefined ? 0 : maxDepth,
                  parents.concat([entityName])
                )).forEach(subField => {
                  report.fields.push({
                    name: key + "." + subField.name,
                    label: key + "." + subField.name,
                    analytical: true,
                    method: "findEntityById",
                    methodOptions: {
                      entityName: model._entity,
                      field: subField
                    },
                    enabled: false,
                    type: subField.type
                  });
                });
              }

              continue;
            }

            // for (const entityName of entityNamesToCheck) {
            //   try {
            //     await this.dataService.details(entityName, value);
            //   } catch (error) {}
            // }
          }

          report.fields.push({
            name: key,
            label: key,
            analytical: true,
            enabled: false,
            type: typeof value as any
          });
        }
      }
    }

    report.fields = report.fields.map(field => {
      if (!field.queries) {
        field.queries = [];
      }

      if (field.type === "array") {
        [
          {
            label: "سایز آرایه برابر باشد با",
            method: "array-length-eq",
            methodInputForm: "field-query-number-eq"
          },

          {
            label: "سایز آرایه برابر نباشد با",
            method: "array-length-eq",
            methodInputForm: "field-query-number-eq"
          }
        ].forEach(f => {
          if (field.queries.filter(p => p.method === f.method).length === 0) {
            field.queries.push(f);
          }
        });
      }

      if (field.type === "number") {
        [
          {
            label: "برابر باشد با",
            method: "number-eq",
            methodInputForm: "field-query-number-eq"
          },
          {
            label: "برابر نباشد با",
            method: "number-neq",
            methodInputForm: "field-query-number-eq"
          },
          {
            label: "در این بازه باشد",
            method: "number-in-range",
            methodInputForm: "field-query-number-range"
          },
          {
            label: "در این بازه نباشد",
            method: "number-nin-range",
            methodInputForm: "field-query-number-range"
          }
        ].forEach(f => {
          if (field.queries.filter(p => p.method === f.method).length === 0) {
            field.queries.push(f);
          }
        });
      }

      if (field.type === "boolean") {
        [
          {
            label: "برابر باشد با",
            method: "boolean-eq",
            methodInputForm: "field-query-boolean-eq"
          }
        ].forEach(f => {
          if (field.queries.filter(p => p.method === f.method).length === 0) {
            field.queries.push(f);
          }
        });
      }

      if (field.type === "date") {
        [
          {
            label: "در این بازه زمانی باشد",
            method: "date-in-range",
            methodInputForm: "field-query-date-range"
          },
          {
            label: "در این بازه زمانی نباشد",
            method: "date-nin-range",
            methodInputForm: "field-query-date-range"
          },
          {
            label: "برابر باشد با",
            method: "date-eq",
            methodInputForm: "field-query-date-eq"
          },
          {
            label: "برابر نباشد با",
            method: "date-neq",
            methodInputForm: "field-query-date-eq"
          }
        ].forEach(f => {
          if (field.queries.filter(p => p.method === f.method).length === 0) {
            field.queries.push(f);
          }
        });

        if (!field.template) {
          field.template = {
            component: "DateViewComponent",
            inputs: {
              format: "jYYYY/jMM/jDD HH:mm:ss"
            },
            formName: "report-async-field-format-date"
          };
        }
      }

      if (field.type === "string") {
        [
          {
            label: "برابر باشد با",
            method: "string-eq",
            methodInputForm: "field-query-date-eq"
          },
          {
            label: "برابر نباشد با",
            method: "string-neq",
            methodInputForm: "field-query-date-eq"
          },
          {
            label: "شامل شود",
            method: "string-contain",
            methodInputForm: "field-query-date-eq"
          }
        ].forEach(f => {
          if (field.queries.filter(p => p.method === f.method).length === 0) {
            field.queries.push(f);
          }
        });
      }

      [
        {
          label: "خالی نباشد",
          method: "neq-null"
        },
        {
          label: "خالی باشد",
          method: "eq-null"
        }
      ].forEach(f => {
        if (field.queries.filter(p => p.method === f.method).length === 0) {
          field.queries.push(f);
        }
      });

      return field;
    });

    return report.fields;
  }

  createDocumentIndex(fields) {
    // `createIndex()` creates an index data structure.
    // First argument specifies how many different fields we want to index.
    const index = createIndex(fields.length);
    // `fieldAccessors` is an array with functions that used to retrieve data from different fields.
    const fieldAccessors = fields.map(f => doc => doc[f.name]);
    // `fieldBoostFactors` is an array of boost factors for each field, in this example all fields will have
    // identical factors.
    const fieldBoostFactors = fields.map(() => 1);

    return {
      // `add()` function will add documents to the index.
      add: doc => {
        addDocumentToIndex(
          index,
          fieldAccessors,
          // Tokenizer is a function that breaks text into words, phrases, symbols, or other meaningful elements
          // called tokens.
          // Lodash function `words()` splits string into an array of its words, see https://lodash.com/docs/#words for
          // details.
          words,
          // Filter is a function that processes tokens and returns terms, terms are used in Inverted Index to
          // index documents.
          term => term.toLowerCase(),
          // Document key, it can be a unique document id or a refernce to a document if you want to store all documents
          // in memory.
          doc._id,
          // Document.
          doc
        );
      },
      // `search()` function will be used to perform queries.
      search: q =>
        ndxQuery(
          index,
          fieldBoostFactors,
          // BM25 ranking function constants:
          1.2, // BM25 k1 constant, controls non-linear term frequency normalization (saturation).
          0.75, // BM25 b constant, controls to what degree document length normalizes tf values.
          words,
          term => term.toLowerCase(),
          // Set of removed documents, in this example we don't want to support removing documents from the index,
          // so we can ignore it by specifying this set as `undefined` value.
          undefined,
          q
        )
    };
  }
  public async indexCommonEnglishWords() {
    const list =
      (await this.http
        .get<string[]>("assets/data/common-words.json")
        .toPromise()) || [];

    const docIndex = this.createDocumentIndex([{ name: "value" }]);

    list.forEach(w => {
      docIndex.add({ value: w });
    });

    this.commonEnglishWordsIndexCache = docIndex;
  }
  public async sync(opts?: {
    onCollectionPush?: (collectionName: string, error: any) => void;
    onCollectionPull?: (collectionName: string, error: any) => void;
    onCollectionIndex?: (collectionName: string, error: any) => void;
  }) {
    if (!opts) {
      opts = {};
    }
    await this.pushCollections(opts.onCollectionPush);

    await this.pullCollections(opts.onCollectionPull);

    await this.indexCommonEnglishWords();
  }
}
