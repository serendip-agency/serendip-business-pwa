import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  fileManagerVisible: boolean = false;

  fileManagerSelectEvent = new EventEmitter();

  fileManagerSelecting = false;


  constructor() { }
}
