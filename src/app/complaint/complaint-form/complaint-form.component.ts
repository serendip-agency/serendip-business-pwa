import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";

import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatChipInput, MatChipList, MatSnackBar } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from 'underscore';
import * as Moment from 'jalali-moment'

@Component({
  selector: "app-complaint-form",
  templateUrl: "./complaint-form.component.html",
  styleUrls: ["./complaint-form.component.css"]
})
export class ComplaintFormComponent implements OnInit {
  complaintForm: FormGroup;

  model: any = {
    socials: [],
    emails: []
  };
  routerSubscription: Subscription;
  cachedEmployees = [];
  filteredPeople: any[] = [];

  cachedCompanies = [];
  filteredCompanies: any[] = [];


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  moment: typeof Moment;


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
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {
    this.moment = Moment;
  }

  save() {
    if (!this.complaintForm.value._id) {
      this.dataService.insert("complaint", this.complaintForm.value);
    } else {
      this.dataService.update("complaint", this.complaintForm.value);
    }
  }

  initForm() {
    this.complaintForm = this.fb.group({
      _id: [""],
      receivedTime: [this.moment().format('HH:mm'), Validators.required],
      receivedDate: [this.moment().format('jYYYY/jMM/jDD'), Validators.required],
      person: [""],
      company: [""],
      type: ['', Validators.required],

    });
  }

  getEmployee(_id) {
    if (this.cachedEmployees[_id])
      return this.cachedEmployees[_id];

    return { firstName: '', lastName: '' };
  }

  goEmployee(_id) {
    var person = this.getEmployee(_id);
    this.snackBar.open('اطلاعات موجود از ' + person.firstName + ' ' + person.lastName + ' را میخواهید؟', 'بله', { duration: 2000 }).onAction().subscribe(() => {
      console.log('go to person page');
    });
  }

  async selectEmployee(event: MatAutocompleteSelectedEvent) {
    this.complaintForm.get('person').setValue(event.option.value);
    this.cachedEmployees[event.option.value] = await this.dataService.details<{ _id: string }>('people', event.option.value);
  }

  async filterPeople(input) {
    console.log(input);
    if (input)
      this.filteredPeople = _.filter(await this.dataService.search('people', input, 10), (item: any) => {
        return item._id != this.complaintForm.get('person').value
      });
  }


  getCompany(_id) {
    if (this.cachedCompanies[_id])
      return this.cachedCompanies[_id];

    return { name: '' };
  }

  goCompany(_id) {
    var company = this.getCompany(_id);
    this.snackBar.open('اطلاعات موجود از ' + company.name + ' را میخواهید؟', 'بله', { duration: 2000 }).onAction().subscribe(() => {
      console.log('go to company page');
    });
  }

  async selectCompany(event: MatAutocompleteSelectedEvent) {
    this.complaintForm.get('company').setValue(event.option.value);
    this.cachedCompanies[event.option.value] = await this.dataService.details<{ _id: string }>('company', event.option.value);
  }

  async filterCompany(input) {
    console.log(input);
    if (input)
      this.filteredCompanies = _.filter(await this.dataService.search('company', input, 10), (item: any) => {
        return item._id != this.complaintForm.get('company').value
      });
  }

  async ngOnInit() {

    // this.routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.handleParams();
    //   }
    // });

    this.initForm();

    const params = this.activatedRoute.snapshot.params;

    this.complaintForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('complaint', params.id);
      console.log(model);
      this.complaintForm.patchValue(model);
      this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }

  }
  handleParams(): any {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
      this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }
  }

}
