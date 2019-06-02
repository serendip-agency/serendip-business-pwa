import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {
  DashboardTabInterface,
  DashboardWidgetInterface,
  EntityModel,
  FieldQueryInterface,
  ReportFieldInterface,
  ReportFormatInterface,
  ReportInterface
} from "serendip-business-model";
import * as sUtil from "serendip-utility";
import { CalendarService } from "src/app/calendar.service";
import { ClubRatingViewComponent } from "src/app/crm/club-rating-view/club-rating-view.component";
import { ContactsViewComponent } from "src/app/crm/contacts-view/contacts-view.component";
import { DashboardService } from "src/app/dashboard.service";
import { DataService } from "src/app/data.service";
import { IdbService } from "src/app/idb.service";
import { ObService } from "src/app/ob.service";
import { ReportService, DateUnitToFormatMap } from "src/app/report.service";
import * as _ from "underscore";
import * as moment from "moment-jalaali";

import { LongTextViewComponent } from "../report/long-text-view/long-text-view.component";
import { ObjectidViewComponent } from "../report/objectid-view/objectid-view.component";
import { ShortTextViewComponent } from "../report/short-text-view/short-text-view.component";
import { StarRatingViewComponent } from "../report/star-rating-view/star-rating-view.component";
import { CurrencyViewComponent } from "./currency-view/currency-view.component";
import { DateViewComponent } from "./date-view/date-view.component";
import { IconViewComponent } from "./icon-view/icon-view.component";
import { PriceViewComponent } from "./price-view/price-view.component";
import { JsonViewComponent } from "./json-view/json-view.component";
import { EntityWebhookViewComponent } from "./entity-webhook-view/entity-webhook-view.component";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.less"]
})
export class ReportComponent implements OnInit {
  fieldDragging: ReportFieldInterface;
  @Output()
  WidgetChange = new EventEmitter<DashboardWidgetInterface>();

  @Output() modelChange = new EventEmitter();

  formatLoaded = false;
  saveMode = "report";
  dateRangeUnitsToSelect = [
    {
      value: "month",
      label: "ماه میلادی"
    },
    {
      value: "jMonth",
      label: "ماه شمسی"
    },
    {
      value: "year",
      label: "سال میلادی"
    },
    {
      value: "jYear",
      label: "سال شمسی"
    },
    {
      value: "day",
      label: "روز"
    },
    {
      value: "minute",
      label: "دقیقه"
    },
    {
      value: "hour",
      label: "ساعت"
    }
  ];
  charts: {
    name: string;
    icon: string;
    dataType: "1d" | "2d";
  }[] = [
    {
      name: "horizontal-bar",
      icon: "bar-chart-horz",
      dataType: "1d"
    },
    {
      name: "vertical-bar",
      icon: "bar-chart-vert",
      dataType: "1d"
    },
    {
      name: "doughnut",
      icon: "doughnut",
      dataType: "1d"
    },
    {
      name: "gauge",
      icon: "gauge",
      dataType: "1d"
    },
    {
      name: "pie",
      icon: "pie-chart",
      dataType: "1d"
    },
    {
      name: "pie-grid",
      icon: "pie-grid",
      dataType: "1d"
    },
    {
      name: "pie-advanced",
      icon: "pie-advanced",
      dataType: "1d"
    },
    {
      name: "number-card",
      icon: "number-cards",
      dataType: "1d"
    },
    {
      name: "line",
      icon: "line-chart",
      dataType: "2d"
    },
    {
      name: "horizontal-grouped-bar",
      icon: "line-chart-grouped-horz",
      dataType: "2d"
    },
    {
      name: "vertical-grouped-bar",
      icon: "line-chart-grouped-vert",
      dataType: "2d"
    },
    {
      name: "horizontal-stacked-bar",
      icon: "stacked-horz",
      dataType: "2d"
    },
    {
      name: "vertical-stacked-bar",
      icon: "stacked-vert",
      dataType: "2d"
    },
    {
      name: "polar",
      icon: "polar",
      dataType: "2d"
    },
    {
      name: "tree-map",
      icon: "tree-map",
      dataType: "1d"
    }
  ];

  @Output()
  DashboardCommand = new EventEmitter<{
    command: "open-tab";
    tab: DashboardTabInterface;
  }>();

  @Output()
  TabChange = new EventEmitter<DashboardTabInterface>();

  @Input() format: ReportFormatInterface = {
    type: "2d",
    chart: "line",
    options: {
      dateRangeEnd: new Date(),
      dateRangeUnit: "day",
      dateRangeCount: 15,
      groupBy: null,
      dateBy: null,
      sizeBy: null
    }
  };
  @Input() title: string;
  @Input() entityName: string;
  @Input() subtitle: string;
  @Input() icon = "folder-archive-open";

  @Input() entityLabelSingular: string;
  @Input() entityLabelPlural: string;

  @Input() reportName: string;
  @Input() pageSize = 20;
  @Input() pageIndex = 0;

  @Input() selected = [];

  @Input() layout: "widget" | "report" = "widget";

  @Input() mode: string | "save" | "chart" | "format" | "report" | "data" =
    "data";
  @Input() page: any[];

  obServiceActive = true;
  reports: { label: string; value: string }[];
  formName: any;
  @Input() formId: any;
  @Input() reportId: string;
  formats: EntityModel[];

  _ = _;
  public sUtil = sUtil;

  @Input() pageCount = 1;

  @Input()
  _report: ReportInterface;
  @Input() formatted: ReportInterface;
  initDone = false;
  error: any;
  _formatFields: any[];

  @Input()
  public set model(v: ReportInterface) {
    this._report = v;
  }

  set report(value: ReportInterface) {
    this._report = value;

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
    PriceViewComponent,
    IconViewComponent,
    JsonViewComponent,
    // Business related  report views
    ClubRatingViewComponent,
    ContactsViewComponent,
    EntityWebhookViewComponent
  };

  resultLoading = false;

  constructor(
    private dashboardService: DashboardService,
    private dataService: DataService,
    private reportService: ReportService,
    private changeRef: ChangeDetectorRef,
    private obService: ObService
  ) {
    moment.loadPersian();
  }

  getFieldsForY() {
    const fields = JSON.parse(
      JSON.stringify(this.getFieldsForSelect("number"))
    );
    const fieldsForY = [];

    for (const f of fields) {
      if (f.value === null) {
        f.label = "شمارش تعداد رکوردها";
      } else {
        if (!f.label.startsWith("مجموع")) {
          f.label = "مجموع " + _.clone(f.label);
        }
      }

      fieldsForY.push(f);
    }
    return fieldsForY;
  }

  getFieldsForSelect(
    ...typeFilter: string[]
  ): { label: string; value: ReportFieldInterface }[] {
    if (this._formatFields) {
      if (typeFilter) {
        return this._formatFields.filter(
          p => !p.value || typeFilter.indexOf(p.value.type) !== -1
        );
      } else {
        return this._formatFields;
      }
    }

    if (
      !this.report ||
      !this.report.fields ||
      !this.report.data ||
      this.report.data.length === 0
    ) {
      return [];
    }
    let fields: { label: string; value: ReportFieldInterface }[] = [];

    this.report.fields.forEach(item => {
      fields.push({
        label: `  ${item.label} `,
        value: item
      });
    });

    // this.report.data.forEach(row => {
    //   for (const key in row) {
    //     if (["_entity", "_business", "_id"].indexOf(key) !== -1) {
    //       continue;
    //     }

    //     if (row.hasOwnProperty(key)) {
    //       const value = row[key];

    //       if (typeof value === "undefined" || value === null) {
    //         continue;
    //       }
    //       if (fields.filter(p => p.value.name === key).length === 0) {
    //         if (key.toLowerCase().indexOf("date") !== -1) {
    //           fields.push({
    //             label: key,
    //             value: { name: key, type: "date" }
    //           });
    //           continue;
    //         }

    //         fields.push({
    //           label: key,
    //           value: { name: key, type: typeof value as any }
    //         });
    //       }
    //     }
    //   }
    // });

    fields = fields.map(field => {
      if (!field.value.type) {
        for (const row of this.report.data) {
          if (
            typeof row[field.value.name] === "undefined" ||
            row[field.value.name] === null
          ) {
            continue;
          }
          if (field.value.name.toLowerCase().indexOf("date") !== -1) {
            field.value.type = "date";
          } else {
            field.value.type = typeof row[field.value.name] as any;
          }
          break;
        }
      }
      return field;
    });

    fields.unshift({ label: "انتخاب نشده", value: null });

    this._formatFields = fields;

    if (typeFilter) {
      return fields.filter(
        p => !p.value || typeFilter.indexOf(p.value.type) !== -1
      );
    }
    return fields;
  }
  getFormatTypes() {
    return [
      {
        label: `بررسی ${this.title} به تفکیک ویژگی`,
        value: "1d"
      },
      {
        label: `بررسی ${this.title} در طول زمان`,
        value: "2d"
      }
    ];
  }

  filterChartsByDataType(dataType): any[] {
    return _.where(this.charts, { dataType: dataType });
  }
  reportFieldDragStart(field, index, event) {
    this.fieldDragging = field;
  }

  reportFieldDragEnd(field, index, event) {
    this.fieldDragging = null;
  }

  async generateFormat() {
    this.resultLoading = true;

    if (!this.format.options.dateRangeUnitEnd) {
      this.format.options.dateRangeUnitEnd = new Date().toString();
    }

    this.format.method = "analyze1d";
    this.format.type = "1d";
    if (this.format.options.dateBy) {
      this.format.method = "analyze2d";
      this.format.type = "2d";
    }

    if (this.format.options.sizeBy) {
      this.format.method = "analyze3d";
      this.format.type = "3d";
    }

    if (this.format.chart) {
      if (
        this.charts.filter(p => p.name === this.format.chart)[0].dataType !==
        this.format.type
      ) {
        this.format.chart = null;
      }
    }

    if (!this.format.chart) {
      this.format.chart = this.charts
        .filter(p => p.dataType === this.format.type)
        .sort((a, b) => Math.random())[0].name;
    }

    if (this.format) {
      this.formatted = await this.reportService.formatReport(
        this.report,
        this.format
      );

      this.WidgetChange.emit({
        inputs: {
          format: this.format,
          formatted: this.formatted,
          mode: "chart"
        }
      });
    }
    this.resultLoading = false;
  }

  formatDateRangeUnitChange(event) {
    this.format.options.dateRangeUnit = event;
    this.WidgetChange.emit({ inputs: { format: this.format } });

    this.generateFormat();
  }
  reportFieldDrop(event) {
    this.fieldDragging = null;
    if (!event) {
      return;
    }
    if (!event.data) {
      return;
    }

    const eventData: { field: ReportFieldInterface; index: number } =
      event.data;

    if (!eventData.field) {
      return;
    }

    this.report.fields.splice(eventData.index, 1);
    this.report.fields.splice(
      event.index > eventData.index ? event.index - 1 : event.index,
      0,
      eventData.field
    );

    this.changeRef.detectChanges();
  }

  allSelected() {
    return this.selected.length === this.pageSize;
  }

  setMode(mode: string) {
    this.mode = mode;

    if (this.mode === "data") {
      this.refresh()
        .then()
        .catch();
    }

    this.WidgetChange.emit({ inputs: { mode } });
  }

  setFormat(format: any) {
    this.format = format;
    this.WidgetChange.emit({ inputs: { format: format } });
  }
  getReportFormatForRadioList() {
    if (!this.formats) {
      return [];
    }
    return this.formats.map(p => {
      return { label: p.label, value: p };
    });
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }
  trackByFn(index: any, item: any) {
    return item._id;
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
    selectedQueries: FieldQueryInterface[]
  ) {
    field.queries = _.map(field.queries, q => {
      if (selectedQueries.indexOf(q) === -1) {
        q.enabled = false;
      } else {
        q.enabled = true;
      }
      return q;
    });
  }

  findEnabledFieldQueries(field: ReportFieldInterface) {
    return _.where(field.queries, { enabled: true });
  }

  async deleteReport() {
    this.report.offline = false;
    //  await this.reportStore.delete(this.report.name);
  }
  async refresh() {
    console.log(
      "report refresh",
      this.report,
      this.entityName,
      this.reportName
    );
    if (this.report && !this.report.offline) {
      delete this.report.data;
    }

    this.resultLoading = true;

    if (!this.report && this.reportName) {
      this.report = _.findWhere(this.dashboardService.schema.reports, {
        name: this.reportName
      }) as any;
    }

    if (!this.report && this.reportId) {
      this.report = (await this.dataService.details(
        "_report",
        this.reportId
      )) as any;
    }

    if (!this.entityName) {
      this.entityName = this.report.entityName;
    }

    if (!this.report) {
      this.report = {
        entityName: this.entityName,
        fields: []
      };
    }

    this.report.fields = _.sortBy(
      await this.dataService.fields(this.entityName, this.report, 1, 3),
      item => item.name.length
    );

    this.report = await this.reportService.generate(this.report);

    this.pageCount = Math.ceil(this.report.count / this.pageSize);

    this.changePage(0);

    this.resultLoading = false;

    // this.WidgetChange.emit({
    //   inputs: {
    //     entityName: this.entityName,
    //     page: this.page,
    //     pageCount: this.pageCount
    //   }
    // });
  }

  async save() {
    if (this.mode !== "save") {
      return this.setMode("save");
    }

    this.resultLoading = true;

    let reportToSave;
    if (this.saveMode === "data") {
      reportToSave = await this.reportService.generate(this.report);
      reportToSave.offline = true;
    } else {
      reportToSave = _.omit(this.report, "data");
    }

    let newReport;

    if (this.report._id) {
      newReport = await this.dataService.update("_report", reportToSave);
    } else {
      newReport = await this.dataService.insert("_report", reportToSave);
    }

    this.reportId = newReport._id;

    this.report = newReport;

    await this.refreshReports();

    this.setMode("report");

    this.resultLoading = false;
  }

  async refreshReports() {
    const reportsQuery = (await this.dataService.list("_report")).filter(
      p => p.entityName === this.entityName
    );

    this.reports = _.chain(reportsQuery)
      .map(item => {
        return {
          label:
            (item.label ? item.label.trim() : moment(item._vdate).fromNow()) +
            // "  ساخته شده در" +
            // this.calendarService
            //   .moment(item._cdate)
            //   .format("YYYY-MM-DD HH:mm:ss") +
            // " توسط " +
            // item._cuser +
            (item.offline ? " ذخیره شده با نتیجه " : ""),
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
    // this.reportId = reportId;

    //  this.report = await this.dataService.details("report", reportId);

    this.report = null;
    this.reportId = reportId;
    this.WidgetChange.emit({ inputs: { reportId } });
    this.refresh();

    //  await this.refresh();
  }

  async ngOnInit() {
    try {
      await this.refresh();
      await this.refreshReports();

      // if (this.format && this.chartType) {
      //   await this.generateFormat();
      // }
    } catch (error) {
      this.error = error;
    }

    this.obService.listen(this.entityName).subscribe(event => {
      if (this.obServiceActive) {
        if (
          event.eventType === "update" &&
          _.findWhere(this.page, { _id: event.model._id })
        ) {
          this.page = this.page.map(p => {
            if (p._id === event.model._id) {
              p = event.model;
            }
            return p;
          });
        }

        if (event.eventType === "insert") {
          if (this.page.filter(p => p._id === event.model._id).length === 0) {
            this.page.unshift(event.model);
          }

          this.report.count++;
        }

        if (event.eventType === "delete") {
          this.page = this.page.filter(p => p._id !== event.model._id);

          this.report.count--;
        }
      }
    });

    this.resultLoading = false;
    this.initDone = true;
  }

  activeFieldQueries() {
    if (
      !this.report ||
      !this.report.fields ||
      this.report.fields.length === 0
    ) {
      return [];
    }

    return this.report.fields.filter(
      item =>
        item.queries &&
        item.queries.length > 0 &&
        item.queries.filter(q => q.enabled).length > 0
    );
  }
  recordSelectChange(_id: string, event: { checked: boolean }) {
    if (event.checked) {
      if (this.selected.indexOf(_id) === -1) {
        this.selected.push(_id);
      }
    } else {
      if (this.selected.indexOf(_id) !== -1) {
        this.selected.splice(this.selected.indexOf(_id), 1);
      }
    }
  }

  allSelectChange($event) {
    if ($event.checked) {
      this.selected = this.getPage().map(item => {
        return item._id;
      });
    } else {
      this.selected = [];
    }
  }
  new() {
    this.DashboardCommand.emit({
      command: "open-tab",
      tab: {
        title: "ثبت " + this.title,
        active: true,
        icon: "office-paper-work-pen",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: this.formName,
              entityIcon: this.icon,
              formId: this.formId
            }
          }
        ]
      }
    });
  }

  addFormat() {
    this.DashboardCommand.emit({
      command: "open-tab",
      tab: {
        title: "ثبت روش نتیجه‌گیری",
        active: true,
        icon: "plus-add-3",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "format-form",
              model: {
                entityName: this.entityName
              }
            }
          }
        ]
      }
    });
  }

  edit() {
    this.selected.forEach(_id => {
      this.DashboardCommand.emit({
        command: "open-tab",
        tab: {
          title: "ویرایش " + this.title,
          active: true,
          icon: "office-paper-work-pen",
          widgets: [
            {
              component: "FormComponent",
              inputs: {
                name: this.formName,
                formId: this.formId,
                documentId: _id,
                entityIcon: this.icon
              }
            }
          ]
        }
      });
    });
  }

  async delete() {
    for (let i = 0; i < this.selected.length; i++) {
      await this.dataService.delete(this.report.entityName, this.selected[i]);
    }

    this.page = _.filter(this.page, item => {
      return this.selected.indexOf(item._id) === -1;
    });

    this.selected = [];

    this.changeRef.detectChanges();
  }

  getPage() {
    return this.report.data;
  }
  async changePage(iterate: number) {
    this.resultLoading = true;

    this.pageIndex += iterate;

    if (iterate !== 0) {
      this.selected = [];
    }

    this.page = _.take(
      _.rest(this.report.data, this.pageSize * this.pageIndex),
      this.pageSize
    );

    this.resultLoading = false;
  }
}
