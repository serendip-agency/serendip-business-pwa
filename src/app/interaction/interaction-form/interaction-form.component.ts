import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";
import { widgetCommandInterface, tabInterface } from "src/app/models";
import { IdbService } from "src/app/idb.service";
import { MatAutocompleteSelectedEvent, MatSnackBar } from "@angular/material";
import * as _ from 'underscore';
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
  selector: "app-interaction-form",
  templateUrl: "./interaction-form.component.html",
  styleUrls: ["./interaction-form.component.css"]
})
export class InteractionFormComponent implements OnInit {

  mainForm: FormGroup;

  componentName: string = 'InteractionFormComponent';

  cachedEmployees = [];
  filteredPeople: any[] = [];

  cachedCompanies = [];
  filteredCompanies: any[] = [];


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
    private router: Router,
    private dashboardService: DashboardService,
    private idbService: IdbService,
    private snackBar: MatSnackBar
  ) { }

  reset() {
    this.mainForm.reset();
  }

  getFormArray(form, arrayName) {
    return (form as any).get(arrayName).controls;
  }

  async save() {

    if (!this.mainForm.value._id) {
      var insertResponse = await this.dataService.insert("interaction", this.mainForm.value);
      this.documentId = insertResponse._id;
      this.mainForm.patchValue(insertResponse);
      this.widgetTabChange.emit({ title: 'ویرایش تعامل ' + this.mainForm.value.name });
    } else {
      this.dataService.update("interaction", this.mainForm.value);
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

  async ngOnInit() {

    this.mainForm = this.fb.group({
      _id: [""],
      user: [""],
      company: [""],
      person: [""],
      sessionId: [""],
      sessionProvider: [""],
      type: ['', Validators.required],
      path: ['', Validators.required],
      campaignTrees: this.fb.group({
        // utm_campaign should be campaign id of existing record in database
        campaign: [""],
        // utm_source ex: google, newsletter
        source: [""],
        // utm_medium ex: banner, cpc, email
        medium: [""],
        // utm_content will be used for A/B testing ex: google-ad-1, logoWeb 
        content: [""],
      }),
      submitDateTime: [""],
      __submitDate: [""],
      __submitTime: [""],

      interactDateTime: [""],
      __interactTime: [""],
      __interactDate: [""],

      sales: this.fb.array([]),
      tempSale: [''],
      services: this.fb.array([]),
      tempService: [''],
      complaints: this.fb.array([]),
      tempComplaint: [''],
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
    this.mainForm.get('person').setValue(event.option.value);
    this.cachedEmployees[event.option.value] = await this.dataService.details<{ _id: string }>('people', event.option.value);
  }

  async filterPeople(input) {
    console.log(input);
    if (input)
      this.filteredPeople = _.filter(await this.dataService.search('people', input, 10), (item: any) => {
        return item._id != this.mainForm.get('person').value
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
    this.mainForm.get('company').setValue(event.option.value);
    this.cachedCompanies[event.option.value] = await this.dataService.details<{ _id: string }>('company', event.option.value);
  }

  async filterCompany(input) {
    console.log(input);
    if (input)
      this.filteredCompanies = _.filter(await this.dataService.search('company', input, 10), (item: any) => {
        return item._id != this.mainForm.get('company').value
      });
  }




}
