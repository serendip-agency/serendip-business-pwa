import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { WsService } from "../ws.service";
import { AuthService } from "../auth.service";
import * as promise_serial from "promise-serial";
import * as _ from "underscore";
import { DataService } from "../data.service";

@Component({
  selector: "app-storage",
  templateUrl: "./storage.component.html",
  styleUrls: ["./storage.component.less"]
})
export class StorageComponent implements OnInit {
  socket: WebSocket;
  toUpload: any = {};

  objectKeys(object) {
    return Object.keys(object);
  }

  constructor(
    public wsService: WsService,
    public authService: AuthService,
    public dataService: DataService,
    public changeRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.socket = await this.wsService.newSocket("/storage", true);
    this.socket.send(new Date().toString());
    const token = await this.authService.token();
    this.socket.onclose = async closeEv => {
      console.log(closeEv);
      this.socket = null;
      this.socket = await this.wsService.newSocket("/storage", true);
    };

    this.socket.onmessage = msg => {
      console.log(msg);
    };

    const uploadZone = document.getElementById("upload-zone");
    uploadZone.onchange = async zoneChangeEv => {
      const files: FileList = (zoneChangeEv.target as any).files;

      const readPromises = new Array(files.length)
        .fill(0, 0, files.length)
        .map((v, i) => {
          return () =>
            new Promise((resolve, reject) => {
              console.log("reading", i);
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

                const path = "users/" + token.userId + "/" + files.item(i).name;

                console.log(path);

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
      (uploadZone as any).value = "";

      this.processQueue();
    };
  }

  async processQueue() {
    if (Object.keys(this.toUpload).length > 0) {
      const item: any = this.toUpload[Object.keys(this.toUpload)[0]];
      await this.upload(item.path, item.data);

      delete this.toUpload[item.path];

      setTimeout(() => {
        this.processQueue();
      }, 1000);
    }
  }

  readableSize(input) {
    return input.toFixed(2) + " MB";
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

    console.log(remoteParts);

    const partSize = 1024 * 1024;
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

            resolve();
          });
      }),
      { parallelize: 1 }
    );

    this.socket.send(
      JSON.stringify({
        type: "assemble",
        path
      })
    );
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
