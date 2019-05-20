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

  previewItem: {

    mime: string,
    ext: string

  } = null;

  previewPath: string = null;

  constructor() { }



}
