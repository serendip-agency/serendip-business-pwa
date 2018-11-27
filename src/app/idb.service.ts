import { Injectable } from "@angular/core";
import * as idb from "idb";
import * as _ from "underscore";
import * as promiseSerial from "promise-serial";
export class Idb {
  dbPromise: Promise<idb.DB>;
  store: string;
  constructor(_dbPromise, _store) {
    this.dbPromise = _dbPromise;
    this.store = _store;

    console.log("IDB > " + this.store);
  }

  async keys() {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store);
      const keys = [];

      return tx.objectStore(this.store).getAllKeys();
      //  const oStore = tx.objectStore(this.store);

      // This would be this.store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      // (oStore.iterateKeyCursor || oStore.iterateCursor).call(oStore, cursor => {
      //   if (!cursor) {
      //     return;
      //   }
      //   keys.push(cursor.key);
      //   cursor.continue();
      // });

      // return tx.complete.then(() => {
      //   console.log("keys done");
      //   return keys;
      // });
    });
  }

  async list(skip?, limit?) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store);
      const records = [];
      const oStore = tx.objectStore(this.store);

      let recordSkipped = 0;

      // This would be this.store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back

      oStore.iterateCursor(cursor => {
        if (!cursor) {
          return;
        }

        if (!skip || recordSkipped >= skip) {
          records.push(cursor.value);
        } else {
          recordSkipped++;
        }

        if (limit) {
          if (records.length === limit) {
            return;
          }
        }

        cursor.continue();
      });

      return tx.complete.then(() => {
        return records;
      });
    });
  }

  async get(key) {
    return this.dbPromise.then(db => {
      return db
        .transaction(this.store)
        .objectStore(this.store)
        .get(key);
    });
  }

  async getAll() {
    return this.dbPromise.then(db => {
      return db
        .transaction(this.store)
        .objectStore(this.store)
        .getAll();
    });
  }

  async count() {
    return this.dbPromise.then(db => {
      return db
        .transaction(this.store)
        .objectStore(this.store)
        .count();
    });
  }
  async set(key, val) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, "readwrite");

      return tx.objectStore(this.store).put(val, key);
      //  return tx.complete;
    });
  }
  async setAll(data: { key: string; val: any }[]) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, "readwrite");
      return promiseSerial(
        _.map(data, item => {
          return () => tx.objectStore(this.store).put(item.val, item.key);
        }),
        { parallelize: 100 }
      );
    });
  }
  async delete(key) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, "readwrite");
      tx.objectStore(this.store).delete(key);
      return tx.complete;
    });
  }
  async clear() {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, "readwrite");
      tx.objectStore(this.store).clear();
      return tx.complete;
    });
  }
}

@Injectable()
export class IdbService {
  constructor() {
    console.log("IdbService constructed ...");
  }

  async syncIDB(store: "pull" | "push") {
    return new Idb(
      idb.default.open("SYNC", 1, db => {
        db.createObjectStore("pull");
        db.createObjectStore("push");
      }),
      store
    );
  }

  async cacheIDB() {
    return new Idb(
      idb.default.open("CACHE", 1, db => {
        db.createObjectStore("cache");
      }),
      "cache"
    );
  }

  async dataIDB() {
    return new Idb(
      idb.default.open("DATA", 1, db => {
        db.createObjectStore("collections");
      }),
      "collections"
    );
  }

  async reportIDB() {
    return new Idb(
      idb.default.open("REPORT", 1, db => {
        db.createObjectStore("report");
      }),
      "report"
    );
  }
}
