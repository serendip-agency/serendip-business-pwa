import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  fileManagerVisible: boolean = false;

  fileManagerSelectEvent = new EventEmitter();

  fileManagerSelecting: string = null;
  fileManagerSelectedPaths: any = [];

  private _fileManagerFolderPath;
  public get fileManagerFolderPath() {
    if (
      localStorage.getItem("storageService.fileManagerFolderPath") == "null" ||
      !localStorage.getItem("storageService.fileManagerFolderPath")
    ) {
      localStorage.setItem("storageService.fileManagerFolderPath", "/");
    }

    return (
      this._fileManagerFolderPath ||
      localStorage.getItem("storageService.fileManagerFolderPath") ||
      "/"
    );
  }
  public set fileManagerFolderPath(value) {
    this._fileManagerFolderPath = value;
    localStorage.setItem("storageService.fileManagerFolderPath", value || "");
  }

  loadingText: string = null;
  previewItem: {
    basename: string;
    sizeInMB: number;
    size: number;
    mime: string;
    path: string;
    ext: string;
  } = null;

  previewPath: string = null;

  constructor() {}
}
