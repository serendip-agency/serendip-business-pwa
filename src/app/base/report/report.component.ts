import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { ReportModel } from 'serendip-business-model';
import { ObjectidViewComponent } from '../report/objectid-view/objectid-view.component';
import { ShortTextViewComponent } from '../report/short-text-view/short-text-view.component';
import { LongTextViewComponent } from '../report/long-text-view/long-text-view.component';
import { StarRatingViewComponent } from '../report/star-rating-view/star-rating-view.component';
import { ClubRatingViewComponent } from 'src/app/crm/club-rating-view/club-rating-view.component';
import { widgetCommandInterface } from 'src/app/models';
import * as _ from 'underscore';
import { ContactViewComponent } from 'src/app/crm/contact-view/contact-view.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  @Output() widgetCommand: EventEmitter<widgetCommandInterface> = new EventEmitter<widgetCommandInterface>();

  @Input() title: string;
  @Input() subtitle: string;
  @Input() icon: string = 'folder-archive-open';

  @Input() entityName: string;
  @Input() entityLabelSingular: string;
  @Input() entityLabelPlural: string;

  @Input() listId: string;

  report: ReportModel;

  predefinedLists: Object;

  result: ReportModel;


  viewComponents = {

    // report views

    ObjectidViewComponent,
    ShortTextViewComponent,
    LongTextViewComponent,
    StarRatingViewComponent,

    // Business related  report views
    ClubRatingViewComponent,
    ContactViewComponent,

  }

  constructor(private dataService: DataService, private httpClient: HttpClient) {


  }


  extendObj(obj1, obj2) {
    return _.extend({}, obj1, obj2);
  }

  getViewComponent(name) {
    return this.viewComponents[name];
  }

  async refresh() {

    this.result = await this.dataService.report({
      entity: this.entityName,
      skip: 0,
      limit: 100,
      fields: this.report.fields,
      queries: this.report.queries,
      reportName: this.listId,
      reportSave: false,
      zip: false,
    });

    console.log(this.result);
  }

  async  ngOnInit() {

    this.predefinedLists = await this.httpClient.get("schema/lists.json?v=" + Math.random()).toPromise();
    this.report = {
      entity: this.entityName,
      fields: this.predefinedLists[this.listId].report.fields,
      queries: this.predefinedLists[this.listId].report.queries,
      createDate: new Date(),
      data: []
    };

    await this.refresh();


  }



}
