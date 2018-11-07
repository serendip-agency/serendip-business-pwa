import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import * as _ from 'underscore'
import * as Async from 'async'
import { IdbService } from './idb.service';

export interface syncOptions {
  onCollectionSync?: Function
}

@Injectable()
export class SyncService {


  private dataService: DataService;


  private collections: string[] = [
    "company"
  ]

  idbService: IdbService;

  constructor(_dataService: DataService, _idbService: IdbService) {

    console.log('SyncService constructed ...');

    this.dataService = _dataService;
    this.idbService = _idbService;

  }

  public async pullCollection(collection) {
    var historyStore = await this.idbService.syncIDB('pull');

    var lastSync: number;

    try {
      var syncKeys = _.filter(await historyStore.keys(), (item: string) => {
        return item.toString().indexOf(collection) == 0
      }).reverse();

      if (syncKeys && syncKeys.length > 0)
        lastSync = parseInt(syncKeys[0].split('_')[1]);

    } catch (e) {
      console.log(e);
    }

    var store = await this.idbService.dataIDB(collection);
    var changesToSync;

    if (lastSync) {
      changesToSync = await this.dataService.changes(collection, lastSync, Date.now());
      if (changesToSync.deleted.length > 0)
        await Promise.all(
          changesToSync.deleted.map(key => {
            return store.delete(key);
          }));
    }

    var data = await this.dataService.zip(collection, lastSync, Date.now());
    var recordInserted = 0;
    await Promise.all(_.map(data, (record: any) => {

      return new Promise(async (_resolve, _reject) => {
        await store.set(record._id, record);

        recordInserted++;

        // console.log(collection, recordInserted * 100 / data.length);

        _resolve();

      });
    }));

    await historyStore.set(collection + '_' + Date.now(), { events: changesToSync });


  }

  public push(opts: syncOptions) {

    return new Promise(async (resolve, reject) => {

      var store = await this.idbService.syncIDB('push');
      var keys = await store.keys();

      var pushes = _.map(keys, (key) => {
        return {
          key: key,
          promise: new Promise(async (_resolve, _reject) => {

            var pushModel = await store.get(key);
            await this.dataService.request(pushModel.opts);
            _resolve();

          })
        }
      });

      var runInSeries = (index) => {

        var pushModel: any = pushes[index];
        pushModel.promise.then(() => {

          store.delete(pushModel.key);
          index++;

          if (index == pushes.length) {

            resolve();

          } else runInSeries(index);

        }).catch((e) => { reject(); });

      };

      if (pushes.length > 0)
        runInSeries(0);
      else
        resolve();


    });

  }

  public pullCollections(onCollectionSync?: Function) {

    console.log('pull started');
    return new Promise((resolve, reject) => {

      var runInSeries = (index) => {

        var collection = this.collections[index];
        this.pullCollection(collection).then(() => {

          if (onCollectionSync)
            onCollectionSync(collection);

          DataService.synced.push(collection);

          index++;

          if (index == this.collections.length) {

            resolve();

          } else runInSeries(index);

        }).catch((e) => { reject(e); });

      };


      runInSeries(0);

    });
  }

  public async pull(opts: syncOptions) {

    await this.pullCollections(opts.onCollectionSync);

  }

  public async start(opts: syncOptions) {

    console.log('push start');
    try {
      await this.push(opts);
      console.log('push done');
    } catch (error) {
      console.log('push fail');
    }


    console.log('pull start');
    try {
      await this.pull(opts);
      console.log('pull done');
    } catch (error) {
      console.log('pull fail');

    }

  }



}
