import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { PageEvent } from "@angular/material";
import {
  ReportModel,
  ReportFieldInterface,
  ReportFieldQueryInterface
} from "serendip-business-model";
import * as sUtils from "serendip-utility";
import { ClubRatingViewComponent } from "src/app/crm/club-rating-view/club-rating-view.component";
import { ContactViewComponent } from "src/app/crm/contact-view/contact-view.component";
import { ContactsViewComponent } from "src/app/crm/contacts-view/contacts-view.component";
import { DashboardService } from "src/app/dashboard.service";
import { DataService } from "src/app/data.service";
import { WidgetCommandInterface } from "src/app/models";
import * as _ from "underscore";

import { LongTextViewComponent } from "../report/long-text-view/long-text-view.component";
import { ObjectidViewComponent } from "../report/objectid-view/objectid-view.component";
import { ShortTextViewComponent } from "../report/short-text-view/short-text-view.component";
import { StarRatingViewComponent } from "../report/star-rating-view/star-rating-view.component";
import { CurrencyViewComponent } from "./currency-view/currency-view.component";
import { DateViewComponent } from "./date-view/date-view.component";
import {
  DashboardWidgetInterface,
  DashboardTabInterface
} from "serendip-business-model";

import { IdbService, Idb } from "src/app/idb.service";

import * as Moment from "moment";
import * as MomentJalaali from "moment-jalaali";
import * as sUtil from "serendip-utility";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.less"]
})
export class ReportComponent implements OnInit {
  @Output()
  WidgetChange = new EventEmitter<DashboardWidgetInterface>();

  @Output()
  DashboardCommand = new EventEmitter<WidgetCommandInterface>();

  @Output()
  TabChange = new EventEmitter<DashboardTabInterface>();

  @Input() title: string;
  @Input() entityName: string;
  @Input() subtitle: string;
  @Input() icon = "folder-archive-open";

  @Input() entityLabelSingular: string;
  @Input() entityLabelPlural: string;

  @Input() reportName: string;

  @Input() pageSize = 20;
  @Input() pageIndex = 0;

  _mode: "report" | "data" = "data";
  reportStore: Idb;
  page: any[] = [];
  reports: { label: string; value: string }[];
  set mode(value: "report" | "data") {
    this._mode = value;
    console.log("set mode");
  }

  get mode() {
    return this._mode;
  }
  _ = _;

  moment: typeof Moment = MomentJalaali;

  pageCount = 1;

  @Input()
  _report: ReportModel;
  set report(value: ReportModel) {
    this._report = value;

    console.log("set report", value);
    this.page = [];
  }

  get report() {
    return this._report;
  }

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
    ContactsViewComponent
  };

  resultLoading = false;

  constructor(
    private dashboardService: DashboardService,
    private dataService: DataService,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef
  ) {}

  modelChange() {
    this.report._id = null;
    this.report.label = null;
    this.checkLabel();

    this.changeRef.detectChanges();
    console.log("model change");
  }

  checkLabel() {
    if (
      !this.report._id &&
      (!this.report.label ||
        (this.report.label.indexOf("_فیلدها: ") === 0 &&
          this.report.label.endsWith("_")))
    ) {
      this.report.label =
        "_فیلدها: " +
        this.report.fields
          .filter(item => {
            return item.enabled;
          })
          .map(item => {
            return item.label;
          })
          .join(", ")
          .trim() +
        "_";

      console.log(this.report.label);
    }
  }
  reportFieldInputsChange(name, newInputs) {
    console.log("reportFieldInputsChange", name, newInputs);
    console.log(name, newInputs);
    this.report.fields = _.map(this.report.fields, item => {
      if (item.name === name) {
        item.templateInputs = newInputs;
      }

      return item;
    });

    this.modelChange();
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }
  trackByFn(index: any, item: any) {
    return item._id;
  }

  getRangeLabel(page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return sUtils.text.replaceEnglishDigitsWithPersian(`0 از ${length}`);
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return sUtils.text.replaceEnglishDigitsWithPersian(
      `${startIndex + 1} - ${endIndex} از ${length}`
    );
  }

  enabledReportFields(): ReportFieldInterface[] {
    return _.where(this.report.fields, { enabled: true });
  }
  extendObj(obj1, obj2) {
    return _.extend({}, obj1, obj2);
  }

  getViewComponent(name) {
    return this.viewComponents[name];
  }

  fieldQuerySelect(
    field: ReportFieldInterface,
    selectedQuery: ReportFieldQueryInterface
  ) {
    field.queries = _.map(field.queries, q => {
      q.enabled = false;
      return q;
    });

    selectedQuery.enabled = true;
  }

  findEnabledFieldQuery(field: ReportFieldInterface) {
    return _.findWhere(field.queries, { enabled: true });
  }

  async deleteReport() {
    this.report.offline = false;
    await this.reportStore.delete(this.report.name);
  }
  async refresh() {
    // if (this.report.name === this.report.entityName + "-default") {
    //   this.result = {
    //     fields: this.report.fields,
    //     name: "",
    //     data: [],
    //     entityName: this.report.entityName,
    //     count: 0,
    //     createDate: new Date()
    //   };

    //   this.result.count = await this.dataService.count(this.report.entityName);
    //   this.pageCount = Math.floor(this.result.count / this.pageSize);
    //   this.changeRef.detectChanges();

    //   this.result.data = await this.dataService.list(
    //     this.report.entityName,
    //     skip,
    //     this.pageSize
    //   );
    // }
    this.resultLoading = true;

    const skip = this.pageIndex * this.pageSize;

    // if (!this.report && this.reportName) {
    //   const offlineReport = await this.reportStore.get(this.reportName);
    //   if (offlineReport) {
    //     this.report = offlineReport;
    //   }
    // }

    // return founded report in idb
    if (this.report && this.report.offline) {
      return this.changePage(0);
    }

    if (!this.report) {
      this.report = _.findWhere(this.dashboardService.schema.reports, {
        name: this.reportName
      }) as any;
    }
    console.log("in refresh method report before await", this.report);

    this.report = await this.dataService.report({
      entity: this.entityName,
      skip: skip,
      limit: this.pageSize,
      report: this.report,
      save: false
    });

    this.page = this.report.data;

    this.pageCount = Math.floor(this.report.count / this.pageSize);

    this.resultLoading = false;

  }

  async deleteOffline() {
    this.resultLoading = true;

    this.report.offline = false;

    await this.reportStore.delete(this.report._id);
    this.resultLoading = false;
  }
  async saveOffline() {
    this.resultLoading = true;
    this.report = await this.dataService.report({
      entity: this.report.entityName,
      skip: 0,
      limit: 0,
      report: this.report,
      save: false
    });
    this.report.offline = true;
    await this.reportStore.set(this.report._id, this.report);
    this.resultLoading = false;
  }
  async saveReport() {
    this.resultLoading = true;
    this.report = await this.dataService.report({
      entity: this.report.entityName,
      skip: 0,
      limit: 0,
      report: this.report,
      save: true
    });

    this.report.offline = true;

    await this.reportStore.set(this.report._id, this.report);

    this.pageIndex = 0;

    this.changePage(0);

    this.resultLoading = false;

    this.changeRef.detectChanges();

    this.refreshReports();
  }

  async refreshReports() {
    this.reports = _.chain(await this.dataService.reports())
      .map(item => {
        return {
          label:
            item.label.trim() +
            " | " +
            sUtil.text.replaceEnglishDigitsWithPersian(
              this.moment(item.createDate).fromNow()
            ),
          value: item._id
        };
      })
      .value();
  }

  sleep(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  async changeReport(reportId) {
    console.log("change report to " + reportId);
    this.report = null;

    this.report = await this.reportStore.get(reportId);
    if (this.report) {
      this.report.offline = true;
    }

    if (!this.report) {
      this.report = { _id: reportId } as any;
    }

    await this.refresh();

    console.log("changed report to ", this.report);
  }

  async ngOnInit() {
    console.log("oninit");
    this.reportStore = await this.idbService.reportIDB();

    await this.dashboardService.setDefaultSchema();

    console.log(await this.dataService.reports());
    await this.refreshReports();

    await this.changePage(0);
    this.checkLabel();

    // setInterval(() => {
    //   this.WidgetChange.emit({
    //     inputs: { mode: this.mode, report: _.omit(this.report, ["data"]) }
    //   });
    // }, 1000);
  }

  async changePage(iterate: number) {
    this.pageIndex += iterate;

    if (this.report && this.report.offline) {
      this.pageCount = Math.floor(this.report.count / this.pageSize);
      this.page = _.take(
        _.rest(this.report.data, this.pageSize * this.pageIndex),
        this.pageSize
      );

      this.resultLoading = false;
    } else {
      await this.refresh();
    }
  }
}
