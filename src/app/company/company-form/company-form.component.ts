

import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from "@angular/core";
import { DataService } from "../../data.service";
import * as _ from 'underscore';
import { IdbService } from "../../idb.service";
import { tabInterface, widgetCommandInterface } from "src/app/models";


@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  componentName: string = 'CompanyFormComponent';


  // model: any = {
  //   socials: [],
  //   emails: []
  // };

  iranStates: { "name": string; "Cities": { "name": string; }[]; }[];

  filteredPeople = [];

  cachedEmployees = [];

  model: { _widgetId: string; _id: string; name: string; type: string; contacts: { name: string; faxes: any[]; telephones: any[]; peoples: any[]; address: { text: string; city: string; state: string; country: string; postalCode: string; geo: string; }; }[]; };


  log(ev) {
    console.log(ev);
  }
  /**
   * unique identifier for this widget. using for state management
   */
  @Input() widgetId: string;
  @Input() documentId: string;
  @Input() tab: any;

  @Output() widgetIdChange = new EventEmitter<string>();
  @Output() widgetDataChange = new EventEmitter<any>();
  @Output() widgetCommand = new EventEmitter<widgetCommandInterface>();
  @Output() widgetTabChange = new EventEmitter<tabInterface>();

  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  constructor(private dataService: DataService, public ref: ChangeDetectorRef, private idbService: IdbService) { }

  trackByFn(index: any, item: any) { return index; }


  async save() {

    if (!this.model._id) {
      var insertResponse = await this.dataService.insert("company", this.model);
      this.documentId = insertResponse._id;
      this.model = insertResponse;
      this.widgetTabChange.emit({ title: 'ویرایش شرکت ' + this.model.name });
    } else
      this.dataService.update("company", this.model);


    var stateDb = await this.idbService.userIDB("state");
    var savedState = await stateDb.get(this.widgetId);

    if (savedState)
      stateDb.delete(this.widgetId);

  }

  reset() {
    this.model = {
      _widgetId: this.widgetId,
      _id: '',
      name: '',
      type: '',
      contacts: [
        {
          name: "اطلاعات تماس اصلی",
          faxes: [''],
          telephones: [''],
          peoples: [],
          address: {
            text: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            geo: ''
          }
        }
      ]
    };
  }


  async ngOnInit() {

    this.reset();

    var stateDb = await this.idbService.userIDB("state");
    var savedState;
    try {
      savedState = await stateDb.get(this.widgetId);
    } catch (error) {
    }

    if (savedState) {
      this.model = savedState.model;
    } else
      if (this.documentId) {
        var model: any = await this.dataService.details('company', this.documentId);


        this.model = model;

        this.widgetTabChange.emit({ title: 'ویرایش شرکت ' + model.name })
      }

    // this.companyForm.valueChanges.subscribe(async (data: any) => {
    //   this.widgetDataChange.emit(data);
    //   var stateKey: string = this.widgetId;
    //   if (!stateKey) {
    //     this.widgetId = stateKey = this.componentName + '-' + Date.now() + '-' + Math.random().toString().split('.')[1];
    //     this.widgetIdChange.emit(this.widgetId);
    //     this.companyForm.patchValue({ "_widgetId": this.widgetId });
    //   }
    //   await stateDb.set(stateKey, { id: stateKey, componentName: this.componentName, model: data, tab: this.tab });
    // });
  }



}
