import { BusinessService } from "./business.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import * as _ from "underscore";
import { IdbService } from "./idb.service";

import * as JsZip from "jszip";

import * as utils from "serendip-utility";
import { MessagingService } from "./messaging.service";
import { UpdateMessage } from "./messaging/updateMessage";
import { InsertMessage } from "./messaging/InsertMessage";
import { DeleteMessage } from "./messaging/DeleteMessage";
import {
  ReportFieldQueryInterface,
  ReportFieldInterface,
  ReportModel,
  ReportInterface
} from "serendip-business-model";

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
  public static synced: string[] = [];

  constructor(
    private messagingService: MessagingService,
    private http: HttpClient,
    private authService: AuthService,
    private idbService: IdbService,
    private businessService: BusinessService
  ) {}

  private async requestError(opts: DataRequestInterface, error) {
    if (error.status === 401) {
      this.authService.logout();
    }

    console.error(error, opts);

    if (error.status !== 400) {
      if (opts.retry) {
        const store = await this.idbService.syncIDB("push");
        store.set(Date.now(), { opts: opts, error: error.toString() });
      }
    }
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
        this.requestError(opts, error);
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

  async list<A>(controller: string, skip, limit): Promise<any> {
    if (DataService.synced.indexOf(controller) !== -1) {
      const storeName = controller.toLowerCase().trim();
      const store = await this.idbService.dataIDB(storeName);

      return store.list(skip, limit);
    } else {
      return this.request({
        method: "POST",
        path: `/api/entity/${controller}/list`,
        model: {
          skip: skip,
          limit: limit
        }
      });
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

  async reports() {
    return this.request({ path: "/api/entity/reports", method: "POST" });
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
      model: opts
    };

    if (opts.zip) {
      requestOpts.raw = true;
    }

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
  }

  async search<A>(
    controller: string,
    query: string,
    take: number
  ): Promise<any> {
    if (DataService.synced.indexOf(controller) !== -1) {
      const storeName = controller.toLowerCase().trim();
      const store = await this.idbService.dataIDB(storeName);

      const keys = await store.keys();

      const result = [];

      await Promise.all(
        _.map(keys, key => {
          return new Promise(async (resolve, reject) => {
            const model = await store.get(key);
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
      return this.request({
        method: "POST",
        path: `/api/entity/${controller}/search`,
        model: {
          take: take,
          query: query
        }
      });
    }
  }

  async count(controller: string): Promise<number> {
    if (DataService.synced.indexOf(controller) !== -1) {
      const store = await this.idbService.dataIDB(controller);
      const keys = await store.keys();
      return keys.length;
    } else {
      return this.request({
        method: "POST",
        path: `/api/entity/${controller}/count`
      });
    }
  }

  async details<A>(controller: string, _id: string): Promise<A> {
    const model = { _id: _id };

    if (DataService.synced.indexOf(controller) !== -1) {
      const store = await this.idbService.dataIDB(controller);
      return store.get(_id);
    } else {
      return this.request({
        method: "POST",
        path: `/api/entity/${controller}/details`,
        model: model
      });
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
      model: model
    });
  }

  async insert<A>(
    controller: string,
    model: A,
    modelName?: string
  ): Promise<A> {
    this.messagingService.publish(new InsertMessage(model), [controller]);

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/insert`,
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
    const store = await this.idbService.dataIDB(controller);
    store.set((model as any)._id, model);

    this.messagingService.publish(new UpdateMessage(model), [controller]);

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

    this.messagingService.publish(new DeleteMessage(model), [controller]);

    return this.request({
      method: "POST",
      path: `/api/entity/${controller}/delete`,
      model: model,
      retry: true
    });
  }
}
