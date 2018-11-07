import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { ReportModel } from 'serendip-business-model';
import { ObjectidViewComponent } from '../report/objectid-view/objectid-view.component';
import { ShortTextViewComponent } from '../report/short-text-view/short-text-view.component';
import { LongTextViewComponent } from '../report/long-text-view/long-text-view.component';
import { StarRatingViewComponent } from '../report/star-rating-view/star-rating-view.component';
import { ClubRatingViewComponent } from 'src/app/crm/club-rating-view/club-rating-view.component';
import * as _ from 'underscore';
import { ContactViewComponent } from 'src/app/crm/contact-view/contact-view.component';
import { ContactsViewComponent } from 'src/app/crm/contacts-view/contacts-view.component';
import { DateViewComponent } from './date-view/date-view.component';
import { CurrencyViewComponent } from './currency-view/currency-view.component';
import { PageEvent } from '@angular/material';
import * as sUtils from 'serendip-utility';
import { DashboardService } from 'src/app/dashboard.service';
import { WidgetCommandInterface } from 'src/app/models';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  @Output() widgetCommand: EventEmitter<WidgetCommandInterface> = new EventEmitter<WidgetCommandInterface>();

  @Input() title: string;
  @Input() subtitle: string;
  @Input() icon: string = 'folder-archive-open';

  @Input() entityName: string;
  @Input() entityLabelSingular: string;
  @Input() entityLabelPlural: string;

  @Input() listId: string;

  @Input() pageSize: number = 20;
  @Input() pageIndex: number = 0;

  @Input() mode: 'report' | 'data' = 'data';

  _ = _;
  pageCount = 1;

  report: ReportModel;

  predefinedReports: Object;

  result: ReportModel;


  viewComponents = {

    // report views

    ObjectidViewComponent,
    ShortTextViewComponent,
    LongTextViewComponent,
    StarRatingViewComponent,
    DateViewComponent,
    CurrencyViewComponent,

    // Business related  report views
    ClubRatingViewComponent,
    ContactViewComponent,
    ContactsViewComponent,

  }

  resultLoading = false;

  fields: any;

  constructor(private dashboardService: DashboardService, private dataService: DataService, private httpClient: HttpClient, private changeRef: ChangeDetectorRef) {

  }


  reportFieldInputsChange(name, newInputs) {

    console.log(name, newInputs);
    this.report.fields = _.map(this.report.fields, (item) => {

      if (item.name == name)
        item.templateInputs = newInputs;

      return item;

    });


  }
  reportFieldChange(name, $event: { checked: boolean }) {

    if ($event.checked)
      this.report.fields.push({ name: name });
    else
      this.report.fields = _.filter(this.report.fields, (item) => { return item.name != name });

  }

  objectKeys(obj) {
    return Object.keys(obj);
  }
  trackByFn(index: any, item: any) { return item._id; }


  getRangeLabel(page: number, pageSize: number, length: number) {
    if (length == 0 || pageSize == 0) {
      return sUtils.text.replaceEnglishDigitsWithPersian(`0 از ${length}`);
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return sUtils.text.replaceEnglishDigitsWithPersian(`${startIndex + 1} - ${endIndex} از ${length}`);
  }


  changePage(event: PageEvent) {
    console.log(event);
  }
  extendObj(obj1, obj2) {
    return _.extend({}, obj1, obj2);
  }

  getViewComponent(name) {
    return this.viewComponents[name];
  }

  async refresh() {

    this.resultLoading = true;
    var skip = this.pageIndex * this.pageSize;

    if (!this.report.queries || this.report.queries.length == 0) {

      this.result = {
        fields: this.report.fields,
        name: '',
        data: [],
        queries: [],
        entity: this.entityName,
        count: 0,
        createDate: new Date()
      }

      this.result.count = await this.dataService.count(this.entityName);
      this.pageCount = Math.floor(this.result.count / this.pageSize);
      this.changeRef.detectChanges();

      this.result.data = await this.dataService.list(this.entityName, skip, this.pageSize);



    } else {

      this.result = await this.dataService.report({
        entity: this.entityName,
        skip: skip,
        limit: this.pageSize,
        fields: this.report.fields,
        queries: this.report.queries,
        reportName: this.listId,
        reportSave: false,
        zip: false,
      });

      this.pageCount = Math.floor(this.result.count / this.pageSize);


    }

    this.resultLoading = false;

    this.changeRef.detectChanges();

    console.log(this.result);
  }

  async  ngOnInit() {

    this.predefinedReports = this.dashboardService.schema.reports ;

    this.report = {
      name: '',
      entity: this.entityName,
      fields: this.predefinedReports[this.listId].report.fields,
      queries: this.predefinedReports[this.listId].report.queries,
      createDate: new Date(),
      count: 0,
      data: []
    };

    this.fields = this.predefinedReports[this.listId].fields;

    await this.refresh();
  }

  async prevPage() {
    this.pageIndex--;
    await this.refresh();
  }


  async nextPage() {
    this.pageIndex++;
    await this.refresh();
  }


}
