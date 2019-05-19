import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { WsService } from "../ws.service";
import { AuthService } from "../auth.service";
import * as promise_serial from "promise-serial";
import * as _ from "underscore";
import * as serendip_utility from "serendip-utility";
import { DataService } from "../data.service";
import { BusinessService } from "../business.service";
import { DashboardService } from "../dashboard.service";
import { TokenModel } from "serendip-business-model";
import { Buffer } from "buffer";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: "app-storage",
  templateUrl: "./storage.component.html",
  styleUrls: ["./storage.component.less"]
})
export class StorageComponent implements OnInit {
  socket: WebSocket;

  extIcons = {
    zip: 'sell-buy-2',
    rar: 'sell-buy-2',
    pdf: 'pdf-bold',
    png: 'photo-image-picture-landscape',
    mp4: 'photo-image-picture-landscape',
    jpg: 'photo-image-picture-landscape',
    txt: 'information-data-1',
    xls: 'efficiency-chart-1',
    html: 'website-globe',
    apk: 'mobile-smart-phone'
  };

  codeEditorVisible = false;
  visualEditorVisible = false;
  codeEditorLanguage = 'text';
  codeEditorModel = '';
  sUtils = serendip_utility;
  newFolderName = "";

  iframeActive = true;
  codeEditorActive = false;
  @Input() mode = "";
  toUpload: {
    [key: string]: {
      path: string,
      percent: number,
      data: any,
      name: string,
      size: number
    }
  } = {};

  _folders: any = {};
  pathsSelected: boolean;
  modePathsSelected: boolean;
  @Input() modeSelectedPaths: string[] = [];
  previewPath: any;
  imgViewerActive = false;
  previewItem: any;

  visualEditorActive = false;

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




  private _folderPath;
  public get folderPath(): string {

    if (!this._folderPath) {
      this._folderPath = localStorage.getItem('fileManagerFolderPath') || '/';
    }

    return this._folderPath;

  }

  @Input()
  public set folderPath(v: string) {

    if (this._folderPath !== v) {
      this._folderPath = v;
      localStorage.setItem('fileManagerFolderPath', v);
    }
  }


  @Input() public viewMode: "full" | "mini" = "mini";

  @Output() public selectEvents = new EventEmitter<string[]>();

  toDownload: any = {};

  public token: TokenModel;
  @Input() selectType = "multiple";

  constructor(
    public wsService: WsService,
    public authService: AuthService,
    public dataService: DataService,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
    public changeRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }


  codeEditorChange(event) {

  }
  setMode(mode) {
    this.modePathsSelected = false;
    this.mode = mode;
  }


  selectAllToggle() {

    console.log(this.modeSelectedPaths, this.folders[this.folderPath]);

    if (this.modeSelectedPaths.length === this.folders[this.folderPath].length) {

      this.modeSelectedPaths = [];

    } else {
      this.modeSelectedPaths = [];

      this.folders[this.folderPath].map(p => this.modeSelectedPaths.push(p.path));

    }

  }
  getCrumbs() {
    const labeledPath = this.folderPath
      .replace("users/" + this.token.userId, "فایل‌های من")
      .replace(
        "businesses/" + this.businessService.getActiveBusinessId(),
        "فایل‌ های " + this.businessService.business.title
      );

    return labeledPath.split("/").map((label, index) => {
      const path = "";

      // for (let i = index; i <= 0; i--) {
      //   path = this.folderPath.split("/")[i] + path;
      // }

      return {
        label,
        path
      };
    });
  }

  async clickOnSelect(item) {

    if (this.selectType === "single") {
      this.modeSelectedPaths = [item.path];
    } else {
      if (this.modeSelectedPaths.indexOf(item.path) === -1) {
        this.modeSelectedPaths.push(item.path);
      } else {
        this.modeSelectedPaths.splice(
          this.modeSelectedPaths.indexOf(item.path),
          1
        );
      }
    }

  }
  async clickOnItem(item) {
    if (item.isFile) {
      this.previewItem = item;
      var itemPreviewPath = this.dataService.currentServer + '/api/storage/preview' +
        item.path + '?access_token=' + encodeURIComponent((await this.authService.token()).access_token);

      if (this.previewPath == itemPreviewPath) {

        this.previewPath = null;
        this.previewItem = null;
        return;

      } else {
        this.previewPath = itemPreviewPath;
      }

      this.codeEditorVisible = false;
      this.visualEditorVisible = false;
      this.iframeActive = false;
      this.imgViewerActive = false;
      this.codeEditorModel = '';
      this.codeEditorLanguage = {
        json: 'json',
        html: 'html',
        hbs: 'html',
        js: 'javascript',
        ts: 'typescript',
        txt: 'text',
        css: 'css',
        less: 'less',
        scss: 'scss'
      }[item.ext] || 'text';

      if (['js', 'html', 'svg', 'ts', 'json'].indexOf(item.ext) !== -1) {

        const file = await this.dataService.request({
          path: '/api/storage/preview' +
            item.path,
          method: 'get',
          raw: true
        });

        const fileReader = new FileReader();

        fileReader.onloadend = (e: any) => {

          this.codeEditorModel = e.target.result;
          this.codeEditorVisible = true;
          this.changeRef.detectChanges();
        };

        fileReader.readAsText(file.body);
      }

      if(item.mime.indexOf('image/') == 0){
        this.imgViewerActive = true;
      }

      if (item.ext == 'html') {
        this.visualEditorVisible = true;
      }


      if(!this.imgViewerActive) {
      this.iframeActive = true;
      }

    } else {
      this.modeSelectedPaths = [];
      if (this.folderPath !== '/') {
        this.folderPath = this.folderPath + "/" + item.basename;
      } else {
        this.folderPath = item.path;
      }
    }

    this.refreshFolder();
  }

  objectKeys(object) {
    return Object.keys(object);
  }
  cdBack(path: string) {


    const pathToReturn = path.replace("/" + path.split("/").reverse()[0], "");

    if (pathToReturn === "businesses" || pathToReturn === "users") {
      return "/";
    }

    return pathToReturn;

    // if (
    //   path.split("/")[1] === this.businessService.getActiveBusinessId() ||
    //   path.split("/")[1] === this.token.userId
    // ) {
    //   return "";
    // }

    // return path.replace("/" + path.split("/").reverse()[0], "");
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
          path: "businesses/" + this.businessService.business._id,
          basename: "فایل‌های " + this.businessService.business.title
        }
      ];
      return;
    }

    this.folders[this.folderPath] = _.sortBy(
      await this.dataService.request({
        path: "/api/storage/list",
        model: { path: this.folderPath },
        method: "POST"
      }),
      (item: any) => {
        return item.isDirectory ? "000-" : "111-" + item.path;
      }
    );


  }
  async ngOnInit() {


    this.selectEvents.subscribe((paths) => {


      if (this.mode === 'newFolder') {

        if (!paths[0]) {
          return;
        }

        this.dataService.request({
          method: 'post',
          path: '/api/storage/newFolder',
          model: {
            path: this.folderPath + '/' + paths[0]
          }
        }).then(() => {

          this.mode = '';
          this.refreshFolder().then(() => { }).catch(() => { });
        }).catch(() => { });

      }

    });

    if (this.modeSelectedPaths && this.modeSelectedPaths[0]) {
      const arrayWithoutFileName = _.clone(
        this.modeSelectedPaths[0].split("/")
      );
      arrayWithoutFileName.pop();

      this.folderPath = arrayWithoutFileName.join("/");


    }

    this.socket = await this.wsService.newSocket("/storage", true);

    this.socket.onclose = async closeEv => {

      this.socket = null;
      this.socket = await this.wsService.newSocket("/storage", true);
    };

    this.socket.onmessage = msg => {

    };

    this.token = await this.authService.token();

    await this.refreshFolder();
  }
  async uploadZoneChange(zoneChangeEv) {


    const files: FileList = (zoneChangeEv.target as any).files;

    const readPromises = new Array(files.length)
      .fill(0, 0, files.length)
      .map((v, i) => {
        return () =>
          new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.readAsArrayBuffer(files.item(i));

            fileReader.onprogress = ev => {

            };

            fileReader.onerror = ev => {
              reject(ev);
            };

            fileReader.onload = ev => {
              const result: ArrayBuffer = (ev.target as any).result;

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
              };



              resolve();
            };
          });
      });

    await promise_serial(readPromises, { parallelize: 1 });
    (zoneChangeEv.target as any).value = "";

    this.processQueue().then().catch();
  }
  async processQueue() {

    if (Object.keys(this.toUpload).length > 0) {
      const item: any = this.toUpload[Object.keys(this.toUpload)[0]];

      await this.upload(item.path, item.data);

      delete this.toUpload[item.path];


      setTimeout(() => {
        this.refreshFolder().then(() => { }).catch(() => { });
        this.processQueue().then(() => { }).catch(() => { });
      }, 500);
    }
  }

  readableSize(input) {
    if (!input) {
      return;
    }
    return input.toFixed(2);
  }
  async upload(path, arrayBuffer: ArrayBuffer) {
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




    const partSize = 1024 * 1024;

    // if (this.toUpload[path].size < 1024 * 1024 * 10) {
    //   partSize = 1024 * 500;
    // }
    const numberOfParts = Math.ceil(arrayBuffer.byteLength / partSize);

    const buffer = Buffer.from(arrayBuffer);

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

            } else {


              await this.dataService.request({
                method: "POST",
                retry: false,
                model: {
                  type: "upload",
                  data: buffer.slice(i * partSize, (i + 1) * partSize).toString('hex'),
                  start: i * partSize,
                  end:
                    i === numberOfParts - 1
                      ? buffer.byteLength
                      : (i + 1) * partSize,
                  total: buffer.byteLength,
                  path
                } as StorageCommandInterface,
                path: "/api/storage/upload"
              });
            }

            if (this.toUpload[path]) {
              this.toUpload[path].percent = parseInt((
                ((i + 1) / numberOfParts) *
                100
              ).toFixed(0), 10);
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
