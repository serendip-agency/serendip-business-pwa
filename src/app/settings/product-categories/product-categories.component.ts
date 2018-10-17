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
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent implements OnInit {

  componentName: string = 'ProductCategoriesComponent';
  periodUnits = periodUnits;
  moment: typeof Moment;
  mainForm: FormGroup;
  list = [];
  view = [];

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

    this.list = await this.dataService.list('productCategory', 0, 1000);
    this.view = _.map(_.where(this.list, { master: '' }), (item) => {
      return { master: item, items: _.where(this.list, { master: item._id }) };
    });

  }

  async save() {

    var model = {};

    if (!this.mainForm.value._id)
      model = await this.dataService.insert('productCategory', this.mainForm.value);
    else
      await this.dataService.update('productCategory', this.mainForm.value);

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
      master: ['']
    });

    await this.refresh();

  }

}
