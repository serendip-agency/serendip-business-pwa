import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import * as _ from 'underscore';
import { IdbService } from './idb.service';

import * as JsZip from 'jszip'

import *  as utils from 'serendip-utility'
import { MessagingService } from './messaging.service';
import { UpdateMessage } from './messaging/updateMessage';
import { InsertMessage } from './messaging/InsertMessage';
import { DeleteMessage } from './messaging/DeleteMessage';



export interface DataRequestInterface {
  method: string,
  path: string,
  model?: any,
  raw?: boolean,
  retry?: boolean,
  host?: string
}

@Injectable()
export class DataService {
  public static synced: string[] = [];


  constructor(private messagingService: MessagingService, private http: HttpClient, private authService: AuthService, private idbService: IdbService) {



  }

  /**
   * get default crm
   */
  async crm(): Promise<any> {

    if (localStorage.getItem("crm"))
      try {
        return JSON.parse(localStorage.getItem("crm"));
      } catch (error) { }

    var token = await this.authService.token();

    var crmList = await this.http.get<any>(environment.api + '/api/crm/manage/list', {
      headers: {
        Authorization: 'Bearer ' + token.access_token,
        clientid: environment.clientId
      }
    }).toPromise();

    if (crmList.length > 0) {
      localStorage.setItem("crm", JSON.stringify(crmList[0]));
      return crmList[0];
    } else
      return null;
  }

  private async requestError(opts: DataRequestInterface, error) {

    if (error.status == 401)
      this.authService.logout();

    console.error(opts, error);

    if (opts.retry) {

      var store = await this.idbService.syncIDB('push');
      store.set(Date.now(), { opts: opts, error: error.toString() });

    }

  }

  public async request(opts: DataRequestInterface): Promise<any> {

    opts.method = opts.method.trim().toUpperCase();

    console.log('AJAX', opts.path);

    var result = {};

    if (!opts.model)
      opts.model = {};

    if (!opts.host)
      opts.host = environment.api;


    try {

      var token = await this.authService.token();

      var crm = await this.crm();

      if (!opts.model.crm)
        opts.model.crm = crm._id;

      var options: any = {
        headers: {
          Authorization: 'Bearer ' + token.access_token,
          clientid: environment.clientId
        }
      };

      if (opts.raw) {
        options.responseType = 'blob';
        options.observe = 'response'
      }

      if (opts.method.toUpperCase() == 'POST')
        result = await this.http.post(opts.host + opts.path, opts.model, options).toPromise();

      if (opts.method.toUpperCase() == 'GET')
        result = await this.http.get(opts.host + opts.path + '?' + utils.querystring.fromObject(opts.model), options).toPromise();

    } catch (error) {
      this.requestError(opts, error);
    }
    return result;
  }

  public async zip<A>(controller: string, from?: number, to?: number): Promise<A[]> {

    var res: any = await this.request({
      method: 'POST',
      path: `/api/crm/${controller}/zip`,
      model: {
        from: from,
        to: to
      },
      raw: true
    });

    var data = res.body;
    if (!data)
      return [];


    var zip = await JsZip.loadAsync(data, {
      base64: false,
      checkCRC32: true
    });

    var unzippedText: any = await zip.file('data.json').async('text')

    var unzippedArray = JSON.parse(unzippedText);

    return unzippedArray;

  }

  async list<A>(controller: string, skip, limit): Promise<any> {

    if (DataService.synced.indexOf(controller) != -1) {

      var storeName = controller.toLowerCase().trim();
      var store = await this.idbService.dataIDB(storeName);

      var keys = await store.keys();

      return Promise.all(_.map(_.first(_.rest(keys, skip), limit), (key) => {
        return store.get(key);
      }));

    } else {
      return this.request({
        method: 'POST', path: `/api/crm/${controller}/list`,
        model: {
          skip: skip,
          limit: limit
        }
      });
    }

  }


  async search<A>(controller: string, query: string, take: number): Promise<any> {

    if (DataService.synced.indexOf(controller) != -1) {

      var storeName = controller.toLowerCase().trim();
      var store = await this.idbService.dataIDB(storeName);

      var keys = await store.keys();

      var result = [];

      await Promise.all(_.map(keys, (key) => {

        return new Promise(async (resolve, reject) => {

          var model = await store.get(key);
          var modelText = JSON.stringify(model);

          if (modelText.indexOf(query) != -1)
            result.push(model);

          resolve();

        });

      }));

      return _.take(result, take);
    } else {
      return this.request({
        method: 'POST',
        path: `/api/crm/${controller}/search`,
        model: {
          take: take,
          query: query
        }
      });
    }



  }

  async count(controller: string): Promise<number> {

    if (DataService.synced.indexOf(controller) != -1) {
      var store = await this.idbService.dataIDB(controller);
      var keys = await store.keys();
      return keys.length;
    }
    else
      return this.request({ method: 'POST', path: `/api/crm/${controller}/count` });

  }



  async details<A>(controller: string, _id: string): Promise<A> {

    var model = { _id: _id };

    if (DataService.synced.indexOf(controller) != -1) {
      var store = await this.idbService.dataIDB(controller);
      return store.get(_id);
    }
    else
      return this.request({ method: 'POST', path: `/api/crm/${controller}/details`, model: model });

  }



  changes(controller: string, from: number, to: number, _id?: string): Promise<any> {

    var model = {
      _id: _id,
      from: from,
      to: to
    };

    return this.request({ method: 'POST', path: `/api/crm/${controller}/changes`, model: model });

  }



  async insert<A>(controller: string, model: A): Promise<A> {

    this.messagingService.publish(new InsertMessage(model), [controller]);

    return this.request({ method: 'POST', path: `/api/crm/${controller}/insert`, model: model, retry: true });

  }


  async update<A>(controller: string, model: A): Promise<A> {

    var store = await this.idbService.dataIDB(controller);
    store.set((model as any)._id, model);

    this.messagingService.publish(new UpdateMessage(model), [controller]);

    return this.request({ method: 'POST', path: `/api/crm/${controller}/update`, model: model, retry: true });

  }



  delete<A>(controller: string, _id: string): Promise<A> {

    var model = { _id: _id };

    this.messagingService.publish(new DeleteMessage(model), [controller]);

    return this.request({ method: 'POST', path: `/api/crm/${controller}/delete`, model: model, retry: true });

  }


}
