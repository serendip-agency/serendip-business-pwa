import { Injectable } from "@angular/core";
import * as idb from "idb";
import * as _ from "underscore";
import * as promiseSerial from "promise-serial";

import { spawn } from "threads";
import { EventEmitter } from "events";
import { EntityModel } from "serendip-business-model";

export class Idb<T> {
  constructor(
    private dbName: string,
    private storeName: string,
    private thread: any,
    private resultStream: EventEmitter
  ) {}

  private newPid() {
    return (
      Date.now() +
      "_" +
      Math.random()
        .toString()
        .split(".")[1]
    );
  }
  async keys(): Promise<string[]> {
    const pid = this.newPid();
    this.thread.send({
      method: "keys",
      options: {
        dbName: this.dbName,
        storeName: this.storeName
      },
      pid
    });

    return new Promise<string[]>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }

  async list(skip?, limit?): Promise<T[]> {
    const pid = this.newPid();
    this.thread.send({
      method: "list",
      options: {
        dbName: this.dbName,
        storeName: this.storeName,
        skip,
        limit
      },
      pid
    });

    return new Promise<T[]>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }

  async get(key): Promise<T> {
    const pid = this.newPid();
    this.thread.send({
      method: "get",
      options: {
        dbName: this.dbName,
        storeName: this.storeName,
        key
      },
      pid
    });

    return new Promise<T>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }

  async getAll(): Promise<T[]> {
    const pid = this.newPid();
    this.thread.send({
      method: "getAll",
      options: {
        dbName: this.dbName,
        storeName: this.storeName
      },
      pid
    });

    return new Promise<T[]>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }

  async count(): Promise<number> {
    const pid = this.newPid();
    this.thread.send({
      method: "count",
      options: {
        dbName: this.dbName,
        storeName: this.storeName
      },
      pid
    });

    return new Promise<number>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }
  async set(key, val): Promise<void> {
    const pid = this.newPid();
    this.thread.send({
      method: "set",
      options: {
        dbName: this.dbName,
        storeName: this.storeName,
        key,
        val
      },
      pid
    });

    return new Promise<void>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }
  async setAll(data: { key: string; val: any }[]): Promise<void> {
    const pid = this.newPid();
    this.thread.send({
      method: "setAll",
      options: {
        dbName: this.dbName,
        storeName: this.storeName,
        data
      },
      pid
    });

    return new Promise<void>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }
  async delete(key): Promise<void> {
    const pid = this.newPid();
    this.thread.send({
      method: "delete",
      options: {
        dbName: this.dbName,
        storeName: this.storeName,
        key
      },
      pid
    });

    return new Promise<void>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }
  async clear(): Promise<void> {
    const pid = this.newPid();
    this.thread.send({
      method: "clear",
      options: {
        dbName: this.dbName,
        storeName: this.storeName
      },
      pid
    });

    return new Promise<void>((resolve, reject) => {
      this.resultStream.on(pid, result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.model);
      });
    });
  }
}

export const IdbDatabases = ["SYNC", "CACHE", "DATA", "REPORT"];

export const IdbDeleteDatabase = dbName => {
  return idb.default.delete(dbName);
};

export const IdbDeleteAllDatabases = () => {
  return Promise.all(IdbDatabases.map(dbName => IdbDeleteDatabase(dbName)));
};
@Injectable()
export class IdbService {
  resultStream = new EventEmitter();
  thread: any;
  constructor() {
    console.log("IdbService constructed ...");

    this.thread = spawn(location.origin + "/workers/idb.js");

    // TODO: Check for spawn done event

    this.thread

      .on("message", msg => {
        console.log(msg);
        this.resultStream.emit(msg.pid, msg);
      })
      .on("error", e => {});
  }

  async syncIDB(store: "pull" | "push") {
    return new Idb<any>("SYNC", store, this.thread, this.resultStream);
  }

  async cacheIDB() {
    return new Idb<any>("CACHE", "cache", this.thread, this.resultStream);
  }

  async dataIDB() {
    return new Idb<{ [key: string]: EntityModel }>(
      "DATA",
      "collections",
      this.thread,
      this.resultStream
    );
  }
}
