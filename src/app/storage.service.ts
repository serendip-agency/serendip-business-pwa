import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  fileManagerVisible: boolean = true;

  fileManagerSelectEvent = new EventEmitter();

  fileManagerSelecting: string = null;
  fileManagerSelectedPaths: any = [];

  fileManagerFolderPath = '/';


  loadingText: string = null;
  previewItem: {
    basename: string,
    sizeInMB: number,
    size: number,
    mime: string,
    path:string,
    ext: string

  } = null;

  previewPath: string = null;

  constructor() { }



}
