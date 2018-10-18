import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { widgetCommandInterface, tabInterface, periodUnits } from 'src/app/models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MessagingService } from 'src/app/messaging.service';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { DashboardService } from 'src/app/dashboard.service';
import { IdbService } from 'src/app/idb.service';
import { WidgetService } from 'src/app/widget.service';
import * as _ from 'underscore';
import * as Moment from 'moment-jalaali';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.css']
})
export class ServiceTypesComponent implements OnInit {

  componentName: string = 'ServiceTypesComponent';
  periodUnits = periodUnits;
  moment: typeof Moment;
  mainForm: FormGroup;
  list = [];


  model: any = {
    socials: [],
    emails: []
  };

  mode: 'list' | 'form' = "list";

  filteredPeople = [];
  cachedEmployees = [];

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
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private idbService: IdbService,
    private widgetService: WidgetService
  ) {


  }

  async refresh() {

    this.list = await this.dataService.list('serviceType', 0, 1000);

  }

  async edit(item) {

    this.mainForm.reset();

    this.mainForm.patchValue(item);

    this.mode = "form";
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

    var model = {};

    if (!this.mainForm.value._id)
      model = await this.dataService.insert('serviceType', this.mainForm.value);
    else
      await this.dataService.update('serviceType', this.mainForm.value);


    await this.refresh();
    this.mode = 'list';
    this.reset();

  }

  reset() {
    this.mainForm.reset();
  }

  getFormArray(form, arrayName) {
    return (form as any).get(arrayName).controls;
  }


  async ngOnInit() {

    this.moment = Moment;

    //  this.moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

    this.mainForm = this.fb.group({
      _id: [""],
      name: ["", Validators.required],
      price: [''],
      priceCurrency: [''],
      period: [''],
      periodUnit: [''],
      periodAbsoluteExpiration: [''],
      periodRelevantExpiration: [''],
      hasPeriod: [true]
    });

    

    await this.refresh();



  }

}
