import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { WsService } from "../ws.service";
import { AuthService, userToken } from "../auth.service";
import * as promise_serial from "promise-serial";
import * as _ from "underscore";
import * as serendip_utility from "serendip-utility";
import { DataService } from "../data.service";
import { BusinessService } from "../business.service";
import { DashboardService } from "../dashboard.service";

@Component({
  selector: "app-storage",
  templateUrl: "./storage.component.html",
  styleUrls: ["./storage.component.less"]
})
export class StorageComponent implements OnInit {
  socket: WebSocket;

  sUtils = serendip_utility;

  toUpload: any = {};

  _folders: any = {};

  get folders() {
    return this._folders;
  }
  set folders(obj) {
    if (_.isEqual(obj, this._folders)) {
      return;
    }
    let lsFolders: any = localStorage.getItem("folders");
    if (lsFolders) {
      lsFolders = _.extend(JSON.parse(lsFolders), obj);
    } else {
      lsFolders = obj;
    }

    localStorage.setItem("folders", JSON.stringify(lsFolders));
  }

  selectedPaths = [];

  showUserFolderList = true;
  folderPath: string;

  toDownload: any = {};

  public token: userToken;

  constructor(
    public wsService: WsService,
    public authService: AuthService,
    public dataService: DataService,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
    public changeRef: ChangeDetectorRef
  ) {}

  getCrumbs() {
    return this.folderPath
      .replace("users/" + this.token.userId, "فایل‌های من")
      .replace(
        "businesses/" + this.businessService.getActiveBusinessId(),
        "فایل‌ های " + this.businessService.business.title
      )
      .split("/");
  }
  objectKeys(object) {
    return Object.keys(object);
  }
  cdBackDir(path: string) {
    if (
      path.split("/")[1] === this.businessService.getActiveBusinessId() ||
      path.split("/")[1] === this.token.userId
    ) {
      return "";
    }

    return path.replace("/" + path.split("/").reverse()[0], "");
  }
  async refreshFolder() {
    if (!this.folderPath || this.folderPath === "/") {
      this.folders["/"] = [
        {
          isFile: false,
          isDirectory: true,
          path: "users/" + this.token.userId,
          basename: "فایل‌های من"
        },
        {
          isFile: false,
          isDirectory: true,
          path: "businesses/" + this.businessService.getActiveBusinessId(),
          basename: "فایل‌های " + this.businessService.business.title
        }
      ];
      return;
    }

    this.folders[this.folderPath] = _.sortBy(
      await this.dataService.request({
        path: "/api/storage/list",
        model: { path: this.folderPath + "/**" },
        method: "POST"
      }),
      (item: any) => {
        return item.isDirectory ? "000-" : "111-" + item.path;
      }
    );
  }
  async ngOnInit() {
    this.socket = await this.wsService.newSocket("/storage", true);
    this.socket.send(new Date().toString());
    this.token = await this.authService.token();

    await this.refreshFolder();

    this.socket.onclose = async closeEv => {
      console.log(closeEv);
      this.socket = null;
      this.socket = await this.wsService.newSocket("/storage", true);
    };

    this.socket.onmessage = msg => {
      console.log(msg);
    };
  }
  async uploadZoneChange(zoneChangeEv) {
    console.log(zoneChangeEv);

    const files: FileList = (zoneChangeEv.target as any).files;

    const readPromises = new Array(files.length)
      .fill(0, 0, files.length)
      .map((v, i) => {
        return () =>
          new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(files.item(i));

            fileReader.onprogress = ev => {
              console.log((ev.loaded / ev.total) * 100);
            };

            fileReader.onerror = ev => {
              reject(ev);
            };

            fileReader.onload = ev => {
              const result: string = (ev.target as any).result;

              // this.socket.send(JSON.stringify({
              //   type: 'upload',
              //   data: result,
              //   path: 'users/' + token.userId + '/' + files.item(0).name
              // } as StorageCommandInterface));

              const path = this.folderPath + "/" + files.item(i).name;

              this.toUpload[path] = {
                path,
                percent: 0,
                data: result,
                name: files.item(i).name,
                size: files.item(i).size,
                type: files.item(i).type
              };

              resolve();
            };
          });
      });

    await promise_serial(readPromises, { parallelize: 1 });
    (zoneChangeEv.target as any).value = "";

    this.processQueue();
  }
  async processQueue() {
    if (Object.keys(this.toUpload).length > 0) {
      const item: any = this.toUpload[Object.keys(this.toUpload)[0]];
      await this.upload(item.path, item.data);

      delete this.toUpload[item.path];

      await this.refreshFolder();
      setTimeout(() => {
        this.processQueue();
      }, 1000);
    }
  }

  readableSize(input) {
    if (!input) {
      return;
    }
    return input.toFixed(2);
  }
  async upload(path, base64: string) {
    const remoteParts: {
      exists: { start: number; end: number }[];
      missing: { start: number; end: number }[];
    } = await this.dataService.request({
      path: "/api/storage/parts",
      method: "post",
      model: {
        type: "parts",
        path: path
      }
    });

    let partSize = 1024 * 1024;

    if (this.toUpload[path].size < 1024 * 1024 * 10) {
      partSize = 1024 * 500;
    }
    const numberOfParts = Math.ceil(base64.length / partSize);

    await promise_serial(
      new Array(numberOfParts).fill(0, 0, numberOfParts).map((v, i) => {
        return () =>
          new Promise(async (resolve, reject) => {
            if (
              _.any(
                remoteParts.exists,
                (item: { start: number; end: number }) => {
                  return (
                    item.start <= i * partSize && item.end > (i + 1) * partSize
                  );
                }
              )
            ) {
              console.log(`skipping ${i + 1} of ${numberOfParts}`);
            } else {
              console.log(`uploading ${i + 1} of ${numberOfParts}`);

              await this.dataService.request({
                method: "POST",
                retry: false,
                model: {
                  type: "upload",
                  data: base64.slice(i * partSize, (i + 1) * partSize),
                  start: i * partSize,
                  end:
                    i === numberOfParts - 1
                      ? base64.length
                      : (i + 1) * partSize,
                  total: base64.length,
                  path
                } as StorageCommandInterface,
                path: "/api/storage/upload"
              });
            }

            if (this.toUpload[path]) {
              this.toUpload[path].percent = (
                ((i + 1) / numberOfParts) *
                100
              ).toFixed(0);
            }

            this.changeRef.detectChanges();

            setTimeout(() => {
              resolve();
            }, 100);
          });
      }),
      { parallelize: 1 }
    );

    this.dataService.request({
      method: "POST",
      path: "/api/storage/assemble",
      model: {
        path
      }
    });
  }
}

export interface StorageCommandInterface {
  type: "upload" | "download";
  path: string;
  data?: string;
  start?: number;
  end?: number;
  total?: number;
}
