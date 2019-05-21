import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { WsService } from '../ws.service';
import { AuthService } from '../auth.service';
import * as promise_serial from 'promise-serial';
import * as _ from 'underscore';
import * as serendip_utility from 'serendip-utility';
import { DataService } from '../data.service';
import { BusinessService } from '../business.service';
import { DashboardService } from '../dashboard.service';
import { TokenModel } from 'serendip-business-model';
import { Buffer } from 'buffer';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../storage.service';


@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.less']
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
  newFolderName = '';
  newZipName = '';
  newName = '';
  iframeActive = true;
  codeEditorActive = false;
  private _mode = '';
  tempPaths: string[];
  downloadViewActive: boolean;

  public get mode() {


    if (this.storageService.fileManagerSelecting) {
      return 'select';
    }
    return this._mode;

  }
  @Input()

  public set mode(value) {
    this._mode = value;
  }
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
  imgViewerActive = false;

  visualEditorActive = false;

  get folders() {
    return this._folders;
  }
  set folders(obj) {
    if (_.isEqual(obj, this._folders)) {
      return;
    }
    let lsFolders: any = localStorage.getItem('folders');
    if (lsFolders) {
      lsFolders = _.extend(JSON.parse(lsFolders), obj);
    } else {
      lsFolders = obj;
    }

    localStorage.setItem('folders', JSON.stringify(lsFolders));
  }




  // private _folderPath;
  // public get folderPath(): string {

  //   if (!this._folderPath) {
  //     this._folderPath = localStorage.getItem('fileManagerFolderPath') || '/';
  //   }

  //   return this._folderPath;

  // }

  // @Input()
  // public set folderPath(v: string) {

  //   if (this._folderPath !== v) {
  //     this._folderPath = v;
  //     localStorage.setItem('fileManagerFolderPath', v);
  //   }
  // }


  @Input() public viewMode: 'full' | 'mini' = 'mini';

  @Output() public selectEvents = new EventEmitter<string[]>();

  toDownload: any = {};

  public token: TokenModel;
  private _selectType = 'multiple';
  public get selectType() {

    return this.storageService.fileManagerSelecting || this._selectType;
  }
  @Input()

  public set selectType(value) {
    this._selectType = value;
  }

  constructor(
    public wsService: WsService,
    public authService: AuthService,
    public dataService: DataService,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
    public changeRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    public storageService: StorageService
  ) { }


  codeEditorChange(event) {

  }
  setMode(mode) {

    this.modePathsSelected = false;
    this.mode = mode;

    if (mode == 'rename') {
      this.selectType = 'single';
    } else {
      this.selectType = this.storageService.fileManagerSelecting || 'multiple';
    }

    if (mode == 'moveTo') {
      this.selectType = 'folder';
    }


    if (mode == 'copyTo') {
      this.selectType = 'folder';
    }

    if (this.storageService.fileManagerSelectedPaths.length > 0) {

      this.selectEvents.emit(this.storageService.fileManagerSelectedPaths);

    }

  }


  selectAllToggle() {

    if (this.selectType == 'single') {
      this.storageService.fileManagerSelectedPaths = [];
      return;
    }

    if (this.storageService.fileManagerSelectedPaths.length === this.folders[this.storageService.fileManagerFolderPath].length) {

      this.storageService.fileManagerSelectedPaths = [];

    } else {
      this.storageService.fileManagerSelectedPaths = [];

      this.folders[this.storageService.fileManagerFolderPath].map(p => this.storageService.fileManagerSelectedPaths.push(p.path));

    }

  }
  getCrumbs() {
    const labeledPath = this.storageService.fileManagerFolderPath
      .replace('users/' + this.token.userId, 'فایل‌های من')
      .replace(
        'businesses/' + this.businessService.getActiveBusinessId(),
        'فایل‌ های ' + this.businessService.business.title
      );

    return labeledPath.split('/').map((label, index) => {
      const path = '';

      // for (let i = index; i <= 0; i--) {
      //   path = this.storageService.fileManagerFolderPath.split("/")[i] + path;
      // }

      return {
        label,
        path
      };
    });
  }

  async clickOnSelect(item) {

    if (this.selectType === 'single' || this.selectType === 'file' || this.selectType === 'folder') {
      if (this.storageService.fileManagerSelectedPaths[0] == item.path) {
        this.storageService.fileManagerSelectedPaths = [];
      }
      else {
        this.storageService.fileManagerSelectedPaths = [item.path];
      }
    } else {
      if (this.storageService.fileManagerSelectedPaths.indexOf(item.path) === -1) {
        this.storageService.fileManagerSelectedPaths.push(item.path);
      } else {
        this.storageService.fileManagerSelectedPaths.splice(
          this.storageService.fileManagerSelectedPaths.indexOf(item.path),
          1
        );
      }
    }

  }
  async clickOnItem(item) {
    if (item.isFile) {
      this.storageService.previewItem = item;
      const itemPreviewPath = this.dataService.currentServer + '/api/storage/preview' +
        item.path + '?access_token=' + encodeURIComponent((await this.authService.token()).access_token);

      if (this.storageService.previewPath === itemPreviewPath) {

        this.storageService.previewPath = null;
        this.storageService.previewItem = null;
        return;

      } else {
        this.storageService.previewPath = itemPreviewPath;
        this.storageService.previewItem = item;


      }

      this.codeEditorVisible = false;
      this.visualEditorVisible = false;
      this.iframeActive = false;
      this.downloadViewActive = false;
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

      if (item.mime.indexOf('image/') == 0) {
        this.imgViewerActive = true;
      }

      if (item.ext == 'html') {
        this.visualEditorVisible = true;
      }


      if (item.mime.indexOf('video/') !== -1 || item.mime.indexOf('audio/') !== -1 || item.mime.indexOf('text/') !== -1) {


        this.iframeActive = true;

      } else {

        this.downloadViewActive = true;
      }

      if (item.mime.indexOf('image/') !== -1) {
        this.imgViewerActive = true;
        this.downloadViewActive = false;

      }


    } else {
      this.storageService.fileManagerSelectedPaths = [];
      if (this.storageService.fileManagerFolderPath !== '/') {
        this.storageService.fileManagerFolderPath = this.storageService.fileManagerFolderPath + '/' + item.basename;
      } else {
        this.storageService.fileManagerFolderPath = item.path;
      }

      this.refreshFolder();

    }


  }

  objectKeys(object) {
    return Object.keys(object);
  }
  cdBack(path: string) {


    const pathToReturn = path.replace('/' + path.split('/').reverse()[0], '');

    if (pathToReturn === 'businesses' || pathToReturn === 'users') {
      return '/';
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
    if (!this.storageService.fileManagerFolderPath || this.storageService.fileManagerFolderPath === '/') {
      this.folders['/'] = [
        {
          isFile: false,
          isDirectory: true,
          path: 'users/' + this.token.userId,
          basename: 'فایل‌های من'
        },
        {
          isFile: false,
          isDirectory: true,
          path: 'businesses/' + this.businessService.business._id,
          basename: 'فایل‌های ' + this.businessService.business.title
        }
      ];
      return;
    }

    this.storageService.loadingText = 'Listing files ...';
    this.folders[this.storageService.fileManagerFolderPath] = _.sortBy(
      await this.dataService.request({
        path: '/api/storage/list',
        model: { path: this.storageService.fileManagerFolderPath },
        method: 'POST'
      }),
      (item: any) => {
        return item.isDirectory ? '000-' : '111-' + item.path;
      }
    );

    this.storageService.loadingText = null;


  }

  selectCancel() {
    this.selectEvents.emit([]);
    this.mode = '';
    this.selectType = 'multiple';
    this.storageService.fileManagerSelectedPaths = [];

    if (this.storageService.fileManagerSelecting) {

      this.storageService.fileManagerVisible = false;
      this.storageService.fileManagerSelecting = null;


    } else {

    }

  }
  async ngOnInit() {


    this.selectEvents.subscribe((paths: string[]) => {

      if (!paths || paths.length == 0) {
        return;
      }

      if (this.mode == 'select') {

        if (this.storageService.fileManagerSelecting) {
          this.storageService.fileManagerSelectEvent.emit(paths);
        }

      }


      if (this.mode === 'zip') {

        this.tempPaths = paths;
        this.storageService.fileManagerSelectedPaths = [];


        if (this.tempPaths.length <= 3 && this.tempPaths.length > 0) {
          this.newZipName = this.tempPaths.map(p => p.split('/').reverse()[0].split('.')[0]).join('-') + '.zip';
        } else {
          this.newZipName = '';
        }

        this.setMode('newZip');



        return;
      }

      if (this.mode === 'rename') {

        this.tempPaths = paths;
        this.storageService.fileManagerSelectedPaths = [];
        this.setMode('newName');

        return;
      }


      if (this.mode === 'move') {

        this.tempPaths = paths;
        this.storageService.fileManagerSelectedPaths = [];
        this.setMode('moveTo');

        return;
      }



      if (this.mode === 'copy') {

        this.tempPaths = paths;
        this.storageService.fileManagerSelectedPaths = [];
        this.setMode('copyTo');
        return;
      }


      if (this.mode === 'copyTo') {

        this.dataService.request({
          method: 'post',
          path: '/api/storage/copy',
          model: {
            dest: paths[0],
            paths: this.tempPaths
          }
        }).then(() => {

          this.storageService.fileManagerSelectedPaths = [];
          this.selectType = 'multiple';
          this.mode = '';
          this.changeRef.detectChanges();

          this.refreshFolder().then(() => { }).catch(() => { });
        }).catch(() => { });

      }


      if (this.mode === 'moveTo') {

        this.dataService.request({
          method: 'post',
          path: '/api/storage/move',
          model: {
            dest: paths[0],
            paths: this.tempPaths
          }
        }).then(() => {

          this.storageService.fileManagerSelectedPaths = [];
          this.selectType = 'multiple';
          this.mode = '';
          this.changeRef.detectChanges();

          this.refreshFolder().then(() => { }).catch(() => { });
        }).catch(() => { });

      }


      if (this.mode === 'newName') {

        console.log(this.tempPaths);
        this.dataService.request({
          method: 'post',
          path: '/api/storage/rename',
          model: {
            newName: paths[0],
            path: this.tempPaths[0]
          }
        }).then(() => {

          this.storageService.fileManagerSelectedPaths = [];
          this.selectType = 'multiple';
          this.mode = '';
          this.changeRef.detectChanges();

          this.refreshFolder().then(() => { }).catch(() => { });
        }).catch(() => { });

      }


      if (this.mode === 'newZip') {


        this.storageService.loadingText = 'Compressing files ...';


        this.dataService.request({
          method: 'post',
          path: '/api/storage/zip',
          model: {
            zipPath: this.storageService.fileManagerFolderPath + '/' + (this.newZipName || ('zip-' + Date.now() + '.zip')),
            paths: this.tempPaths
          }
        }).then(() => {

          this.storageService.fileManagerSelectedPaths = [];
          this.selectType = 'multiple';
          this.storageService.loadingText = null;
          this.mode = '';
          this.changeRef.detectChanges();


          this.refreshFolder().then(() => { }).catch(() => { });
        }).catch(() => { });

      }



      if (this.mode === 'delete') {

        this.storageService.loadingText = 'Deleting files ...';

        this.dataService.request({
          method: 'post',
          path: '/api/storage/delete',
          model: {
            paths
          }
        }).then(() => {

          this.selectType = 'multiple';
          this.storageService.fileManagerSelectedPaths = [];
          this.storageService.loadingText = null;
          this.mode = '';
          this.changeRef.detectChanges();

          this.refreshFolder().then(() => { }).catch(() => { });
        }).catch(() => { });

      }



      if (this.mode === 'newFolder') {

        if (!paths[0]) {
          return;
        }

        this.storageService.loadingText = 'Creating new folder ...';


        this.dataService.request({
          method: 'post',
          path: '/api/storage/newFolder',
          model: {
            path: this.storageService.fileManagerFolderPath + '/' + paths[0]
          }
        }).then(() => {

          this.selectType = 'multiple';
          this.storageService.fileManagerSelectedPaths = [];
          this.storageService.loadingText = null;
          this.mode = '';
          this.changeRef.detectChanges();

          this.refreshFolder().then(() => { }).catch(() => { });

        }).catch(() => { });

      }

    });

    if (this.storageService.fileManagerSelectedPaths && this.storageService.fileManagerSelectedPaths[0]) {
      const arrayWithoutFileName = _.clone(
        this.storageService.fileManagerSelectedPaths[0].split('/')
      );
      arrayWithoutFileName.pop();

      this.storageService.fileManagerFolderPath = arrayWithoutFileName.join('/');


    }

    this.socket = await this.wsService.newSocket('/storage', true);

    this.socket.onclose = async closeEv => {

      this.socket = null;
      this.socket = await this.wsService.newSocket('/storage', true);
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

              const path = this.storageService.fileManagerFolderPath + '/' + files.item(i).name;

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
    (zoneChangeEv.target as any).value = '';

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
      path: '/api/storage/parts',
      method: 'post',
      model: {
        type: 'parts',
        path
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
                method: 'POST',
                retry: false,
                model: {
                  type: 'upload',
                  data: buffer.slice(i * partSize, (i + 1) * partSize).toString('hex'),
                  start: i * partSize,
                  end:
                    i === numberOfParts - 1
                      ? buffer.byteLength
                      : (i + 1) * partSize,
                  total: buffer.byteLength,
                  path
                } as StorageCommandInterface,
                path: '/api/storage/upload'
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
      method: 'POST',
      path: '/api/storage/assemble',
      model: {
        path
      }
    });
  }
}

export interface StorageCommandInterface {
  type: 'upload' | 'download';
  path: string;
  data?: string;
  start?: number;
  end?: number;
  total?: number;
}
