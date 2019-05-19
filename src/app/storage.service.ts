import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  fileManagerVisible: boolean = true;

  fileManagerSelectEvent = new EventEmitter();

  fileManagerSelecting: string = null;


  constructor() { }
}
