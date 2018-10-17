

import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";
import IranStates from "../../geo/IranStates";
import * as _ from 'underscore';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatChipInput, MatChipList, MatSnackBar } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { GmapsService } from "../../gmaps.service";
import { IdbService } from "../../idb.service";
import { tabInterface, widgetCommandInterface } from "src/app/models";
import { WidgetService } from "src/app/widget.service";


@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  componentName: string = 'CompanyFormComponent';

  companyForm: FormGroup;

  model: any = {
    socials: [],
    emails: []
  };

  iranStates: { "name": string; "Cities": { "name": string; }[]; }[];

  filteredPeople = [];

  cachedEmployees = [];

  mapId = `gmap-${Date.now()}`;

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

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  constructor(
    private messagingService: MessagingService,
    public fb: FormBuilder,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    public ref: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private idbService: IdbService,
    private gmapsService: GmapsService,
    private widgetService: WidgetService
  ) {
    this.iranStates = IranStates;
  }

  filterStates(input) {
    return _.filter(this.iranStates, (iState) => {
      return iState.name.indexOf(input) != -1
    })
  }

  filterCities(state, input) {
    if (!state)
      return [];

    if (this.filterStates(state).length == 1)
      state = this.filterStates(state)[0].name;
    else
      return [];

    return _.filter(_.findWhere(this.iranStates, { name: state }).Cities, (city) => {
      return city.name.indexOf(input) != -1
    })
  }


  getEmployee(_id) {

    if (this.cachedEmployees[_id])
      return this.cachedEmployees[_id];

    return null;

  }
  goEmployee(_id) {
    var person = this.getEmployee(_id);
    this.snackBar.open('اطلاعات موجود از ' + person.firstName + ' ' + person.lastName + ' را میخواهید؟', 'بله', { duration: 2000 }).onAction().subscribe(() => {
      console.log('go to person page');
    });
  }
  removeEmployee(contact, item) {
    contact.get('peoples').value.splice(contact.get('peoples').value.indexOf(item), 1)
  }

  async selectEmployee(contact, event: MatAutocompleteSelectedEvent) {
    contact.get('peoples').value.push(event.option.value);

    this.cachedEmployees[event.option.value] = await this.dataService.details<{ _id: string }>('people', event.option.value);

    contact.get('tempEmployee').setValue('');
    this.ref.detectChanges();
  }

  validateEmployees(contact) {
    contact.get('peoples').value = _.filter(contact.get('peoples').value, (item: string) => {
      return item.length == 24
    })
  }

  async filterPeople(input, currentValues) {
    if (input)
      this.filteredPeople = _.filter(await this.dataService.search('people', input, 10), (item: any) => {
        return currentValues.indexOf(item._id) == -1;
      });

  }
  async save() {

    if (!this.companyForm.value._id) {
      var insertResponse = await this.dataService.insert("company", this.companyForm.value);
      this.documentId = insertResponse._id;
      this.companyForm.patchValue(insertResponse);
      this.widgetTabChange.emit({ title: 'ویرایش شرکت ' + this.companyForm.value.name });
    } else {
      this.dataService.update("company", this.companyForm.value);
    }

    var stateDb = await this.idbService.userIDB("state");
    var savedState = await stateDb.get(this.widgetId);
    try {
      savedState
    } catch (error) {
    }

    if (savedState)
      stateDb.delete(this.widgetId);

  }

  reset() {
    this.companyForm.reset();
  }

  getFormArray(form, arrayName) {
    return (form as any).get(arrayName).controls;
  }

  async  setGeo(contact) {

    var defaultPositions = [];

    var lastValue = contact.get('address').get('geo').value.trim();

    if (lastValue) {

      defaultPositions.push({ lat: parseFloat(lastValue.split(',')[0]), lng: parseFloat(lastValue.split(',')[1]) });

    }

    this.gmapsService.selectSingle(this.mapId, defaultPositions);

    var positions = await this.gmapsService.onSelectDone(this.mapId);


    contact.get('address').get('geo').setValue(positions[0].lat + ',' + positions[0].lng);

    // navigator.geolocation.getCurrentPosition((data) => {
    //   contact.get('address').get('geo').setValue(data.coords.latitude + ',' + data.coords.longitude)
    //   console.log(data);
    // }, (error) => {
    //   console.error(error);
    // });
  }

  goGeo(loc) {
    window.open(`https://www.google.com/maps/@${loc},16z?hl=fa`, '_blank');
  }


  async ngOnInit() {

    this.companyForm = this.fb.group({
      _widgetId: [this.widgetId],
      _id: [this.documentId],
      name: ["", Validators.required],
      type: [[]],
      contacts: this.fb.array([
        this.fb.group({
          name: ["اطلاعات تماس اصلی"],
          faxes: this.fb.array(['']),
          telephones: this.fb.array(['']),
          peoples: this.fb.array([]),
          tempEmployee: [''],
          address: this.fb.group({
            text: [""],
            city: [""],
            state: [""],
            country: [""],
            postalCode: [""],
            geo: [""]
          })
        })
      ])
    });

    var stateDb = await this.idbService.userIDB("state");
    var savedState;
    try {
      savedState = await stateDb.get(this.widgetId);
    } catch (error) {
    }

    if (savedState) {
      this.companyForm.patchValue(savedState.model);
    } else
      if (this.documentId) {
        var model: any = await this.dataService.details('company', this.documentId);
        this.companyForm.patchValue(model);
        this.widgetTabChange.emit({ title: 'ویرایش شرکت ' + model.name })
      }

    this.companyForm.valueChanges.subscribe(async (data: any) => {
      this.widgetDataChange.emit(data);
      var stateKey: string = this.widgetId;
      if (!stateKey) {
        this.widgetId = stateKey = this.componentName + '-' + Date.now() + '-' + Math.random().toString().split('.')[1];
        this.widgetIdChange.emit(this.widgetId);
        this.companyForm.patchValue({ "_widgetId": this.widgetId });
      }
      await stateDb.set(stateKey, { id: stateKey, componentName: this.componentName, model: data, tab: this.tab });
    });
  }

  addMobile() {
    (this.companyForm.controls.mobiles as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeMobile(index: number) {
    (this.companyForm.controls.mobiles as FormArray).removeAt(index);
  }

  addSocial() {
    (this.companyForm.controls.socials as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeSocial(index: number) {
    (this.companyForm.controls.socials as FormArray).removeAt(index);
  }
}
