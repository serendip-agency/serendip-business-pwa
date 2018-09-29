import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";
import IranStates from "../../geo/IranStates";
import * as _ from 'underscore';

@Component({
  selector: "app-people-form",
  templateUrl: "./people-form.component.html",
  styleUrls: ["./people-form.component.css"]
})
export class PeopleFormComponent implements OnInit {
  peopleForm: FormGroup;

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
    private router: Router,
    private dashboardService: DashboardService
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

  save() {
    if (!this.peopleForm.value._id) {
      this.dataService.insert("people", this.peopleForm.value);
    } else {
      this.dataService.update("people", this.peopleForm.value);
    }
  }

  reset() {
    this.peopleForm.reset();
  }

  getFormArray(form, arrayName) {
    return (form as any).get(arrayName).controls;
  }


  setGeo(contact) {
    navigator.geolocation.getCurrentPosition((data) => {
      contact.get('address').get('geo').setValue(data.coords.latitude + ',' + data.coords.longitude)
      console.log(data);
    }, (error) => {
      console.error(error);
    });
  }

  goGeo(loc) {
    window.open(`https://www.google.com/maps/@${loc},16z?hl=fa`, '_blank');
  }

  async ngOnInit() {

    // this.routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.handleParams();
    //   }
    // });

    const params = this.activatedRoute.snapshot.params;


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
      // mobiles: this.fb.array([
      //   this.fb.group({
      //     type: [""],
      //     value: [""]
      //   })
      // ]),

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

    this.peopleForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('people', params.id);
      console.log(model);
      this.peopleForm.patchValue(model);
      this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }

  }
  handleParams(): any {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
      this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }
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
