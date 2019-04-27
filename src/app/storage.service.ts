import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  fileManagerVisible: boolean = true;

  constructor() { }
}
