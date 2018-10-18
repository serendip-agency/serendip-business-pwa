import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef, Output, Input, EventEmitter } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";
import IranStates from "../../geo/IranStates";
import * as _ from 'underscore';
import { GmapsService } from "../../gmaps.service";
import { MatSnackBar } from "@angular/material";
import { widgetCommandInterface, tabInterface } from "src/app/models";
import { IdbService } from "src/app/idb.service";
import { WidgetService } from "src/app/widget.service";

@Component({
  selector: "app-people-form",
  templateUrl: "./people-form.component.html",
  styleUrls: ["./people-form.component.css"]
})
export class PeopleFormComponent implements OnInit {
  peopleForm: FormGroup;

  componentName: string = 'PeopleFormComponent';

  @Input() widgetId: string;
  @Input() documentId: string;
  @Input() tab: any;

  @Output() widgetIdChange = new EventEmitter<string>();
  @Output() widgetDataChange = new EventEmitter<any>();
  @Output() widgetCommand = new EventEmitter<widgetCommandInterface>();
  @Output() widgetTabChange = new EventEmitter<tabInterface>();


  model: any = {
    socials: [],
    emails: []
  };
  routerSubscription: Subscription;
  iranStates: { "name": string; "Cities": { "name": string; }[]; }[];

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

  async save() {

    if (!this.peopleForm.value._id) {
      var insertResponse = await this.dataService.insert("people", this.peopleForm.value);
      this.documentId = insertResponse._id;
      this.peopleForm.patchValue(insertResponse);
      this.widgetTabChange.emit({ title: 'ویرایش شخص ' + this.peopleForm.value.firstName });
    } else {
      this.dataService.update("people", this.peopleForm.value);
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
    this.peopleForm.reset();
  }

  getFormArray(form, arrayName) {
    return (form as any).get(arrayName).controls;
  }


  setGeo(contact) {
    // navigator.geolocation.getCurrentPosition((data) => {
    //   contact.get('address').get('geo').setValue(data.coords.latitude + ',' + data.coords.longitude)
    //   console.log(data);
    // }, (error) => {
    //   console.error(error);
    // });

    // this.gmapsService.selectPosition(contact.get('address').get('geo').value, (latlng) => {

    //   if (latlng == undefined) {

    //   } else {
    //     contact.get('address').get('geo').setValue(latlng)
    //   }
    // })




  }

  goGeo(loc) {
    window.open(`https://www.google.com/maps/@${loc},16z?hl=fa`, '_blank');
  }

  async ngOnInit() {

    this.peopleForm = this.fb.group({
      _id: [""],
      firstName: ["", Validators.required],
      lastName: [""],
      address: this.fb.group({
        street: [""],
        city: [""],
        state: [""],
        zip: [""]
      }),
      mobiles: this.fb.array([this.fb.control("")]),
      emails: this.fb.array([this.fb.control("")]),
      socials: this.fb.array([
        this.fb.group({
          type: [""],
          value: [""]
        })
      ]),
      gender: [""],
      contacts: this.fb.array([
        this.fb.group({
          name: ["اطلاعات تماس اصلی"],
          faxes: this.fb.array(['']),
          telephones: this.fb.array(['']),
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
      this.peopleForm.patchValue(savedState.model);
    } else
      if (this.documentId) {
        var model: any = await this.dataService.details('people', this.documentId);
        this.peopleForm.patchValue(model);
        this.widgetTabChange.emit({ title: 'ویرایش شخص ' + model.firstName + ' ' + model.lastName })
      }

    this.peopleForm.valueChanges.subscribe(async (data: any) => {
      this.widgetDataChange.emit(data);
      var stateKey: string = this.widgetId;
      if (!stateKey) {
        this.widgetId = stateKey = this.componentName + '-' + Date.now() + '-' + Math.random().toString().split('.')[1];
        this.widgetIdChange.emit(this.widgetId);
        this.peopleForm.patchValue({ "_widgetId": this.widgetId });
      }
      await stateDb.set(stateKey, { id: stateKey, componentName: this.componentName, model: data, tab: this.tab });
    });

  }


  addMobile() {
    (this.peopleForm.controls.mobiles as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeMobile(index: number) {
    (this.peopleForm.controls.mobiles as FormArray).removeAt(index);
  }

  addSocial() {
    (this.peopleForm.controls.socials as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeSocial(index: number) {
    (this.peopleForm.controls.socials as FormArray).removeAt(index);
  }
}
