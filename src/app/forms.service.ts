import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private httpClient: HttpClient) { }
  private _predefinedForms
  async predefinedForms() {

    if (this._predefinedForms)
      return this._predefinedForms;


    var schema = await this.httpClient.get("schema/forms.json").toPromise();
    this._predefinedForms = schema;
    return this._predefinedForms;


  }

}
