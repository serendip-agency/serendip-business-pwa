import { Injectable } from '@angular/core';
import * as idb from 'idb';

export class Idb {

  dbPromise: Promise<idb.DB>;
  store: string;
  constructor(_dbPromise, _store) {


    this.dbPromise = _dbPromise;
    this.store = _store;

    console.log('IDB > ' + this.store);

  }

  keys() {


    return this.dbPromise.then(db => {

      var tx = db.transaction(this.store);
      var keys = [];
      var ostore = tx.objectStore(this.store);

      // This would be this.store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (ostore.iterateKeyCursor || ostore.iterateCursor).call(ostore, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  };

  get(key) {
    return this.dbPromise.then(db => {
      return db.transaction(this.store)
        .objectStore(this.store).get(key);
    });
  };
  set(key, val) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, 'readwrite');
      tx.objectStore(this.store).put(val, key);
      return tx.complete;
    });
  };
  delete(key) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, 'readwrite');
      tx.objectStore(this.store).delete(key);
      return tx.complete;
    });
  };
  clear() {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.store, 'readwrite');
      tx.objectStore(this.store).clear();
      return tx.complete;
    });
  };

}

@Injectable()
export class IdbService {


  constructor() {
    console.log('IdbService constructed ...');
  }

  async syncIDB(store:  "pull" | "push") {
    return new Idb(idb.default.open("SYNC", 1, (db) => {
      db.createObjectStore("pull");
      db.createObjectStore("push");
    }), store);
  }

  async userIDB(store: "state") {
    return new Idb(idb.default.open("USER", 1, (db) => {
      db.createObjectStore("state");
    }), store);
  }


  async dataIDB(store: string | "company" | "person" | "product") {
    return new Idb(idb.default.open("DB", 1, (db) => {
      db.createObjectStore("company");
      db.createObjectStore("person");
      db.createObjectStore("product");
    }), store);
  }


}
