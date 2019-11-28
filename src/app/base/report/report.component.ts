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
import * as _ from "lodash";
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
  @Input() pageSize = 10;
  @Input() pageIndex = 0;

  @Input() selected = [];

  @Input() layout: "widget" | "report" = "widget";

  @Input() mode: string | "save" | "chart" | "format" | "report" | "data" =
    "data";
  @Input() page: any[] = [];

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
  analyzeFieldsForSelect: any;

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
    public changeRef: ChangeDetectorRef,
    private obService: ObService
  ) {
    moment.loadPersian();
  }

  map(array, key) {
    return array.map(p => p[key]);
  }
  log(input) {
    console.log(input);
  }

  setAnalyzeFieldsForSelect() {
    if (
      !this.report ||
      !this.report.fields ||
      !this.report.data ||
      this.report.data.length === 0
    ) {
      return [];
    }
    const fields: { label: string; value: ReportFieldInterface }[] = [];

    this.report.fields.forEach(item => {
      fields.push({
        label: item.label,
        value: item
      });
    });

    fields.unshift({ label: "انتخاب نشده", value: null });

    this.analyzeFieldsForSelect = {
      groupBy: fields.filter(
        p =>
          !p.value ||
          ["string", "boolean", "number", "array"].indexOf(p.value.type) !== -1
      ),
      dateBy: fields.filter(
        p => !p.value || ["date"].indexOf(p.value.type) !== -1
      ),
      valueBy: fields
        .filter(p => !p.value || p.value.type === "number")
        .reduce((prev, curr) => {
          if (!curr.value) {
            prev.push({
              label: "شمارش تعداد رکوردها",
              value: curr.value || "",
              operator: {
                $sum: 1
              }
            });
          } else {
            prev.push({
              label: "مجموع " + _.clone(curr.label),
              value: curr.value,
              operator: {
                $sum: "$" + curr.value.name
              }
            });

            prev.push({
              label: "میانگین " + _.clone(curr.label),
              value: curr.value,
              operator: {
                $avg: "$" + curr.value.name
              }
            });
          }

          return prev;
        }, [])
    };
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
    return _.filter(this.charts, { dataType });
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

    if (this.format.options.groupBy) {
      this.format.method = "analyze1d";
      this.format.type = "1d";
    }

    if (this.format.options.dateBy) {
      if (!this.format.options.groupBy) {
        return;
      }
      this.format.method = "analyze2d";
      this.format.type = "2d";
    }

    if (this.format.options.sizeBy) {
      if (!this.format.options.dateBy || !this.format.options.groupBy) {
        return;
      }
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
      if (this.report.offline) {
        this.formatted = await this.reportService.offlineAnalyze(
          this.report,
          this.format
        );
      } else {
        this.formatted = await this.reportService.onlineAnalyze(
          this.report,
          this.format
        );
      }

      if (this.formatted) {
        this.mode = "chart";
      }

      // this.WidgetChange.emit({
      //   inputs: {
      //     format: this.format,
      //     formatted: this.formatted,
      //     mode: "chart"
      //   }
      // });
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

  async setMode(mode: string) {
    this.mode = mode;

    if (this.mode === "data") {
      await this.refresh();
      await this.changePage(0);
    }

    this.WidgetChange.emit({ inputs: { mode, report: this.report } });
  }

  setFormat(format: any) {
    this.format = format;
    this.WidgetChange.emit({ inputs: { format } });
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
    return _.filter(this.report.fields, { enabled: true });
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
    return _.filter(field.queries, { enabled: true });
  }

  async deleteReport() {
    this.report.offline = false;
    //  await this.reportStore.delete(this.report.name);
  }
  async refresh() {
    if (this.report && !this.report.offline) {
      delete this.report.data;
    }

    this.resultLoading = true;

    if (!this.report && this.reportName) {
      this.report = _.find(this.dashboardService.schema.reports, {
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

    this.report = await this.reportService.generate(
      this.report,
      this.pageIndex * this.pageSize,
      this.pageSize
    );

    if (this.report.data && this.report.data.length) {
      for (let i = 0; i < 3; i++) {
        this.report.fields = await this.dataService.fields(
          this.entityName,
          this.report,
          1,
          3,
          [],
          this.report.fields.length === 0
        );
      }
    }

    this.setAnalyzeFieldsForSelect();

    this.pageCount = Math.ceil(this.report.count / this.pageSize);

    this.resultLoading = false;

    this.WidgetChange.emit({
      inputs: {
        report: this.report,
        entityName: this.entityName,
        page: this.page,
        pageCount: this.pageCount
      }
    });

    await this.changePage(0);
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

    this.obService.listen(this.entityName).subscribe(async event => {
      if (this.obServiceActive) {
        if (
          event.eventType === "update" &&
          _.find(this.page, { _id: event.model._id })
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

        this.report.fields = await this.dataService.fields(
          this.entityName,
          this.report,
          1,
          3,
          [],
          this.report.fields.length === 0
        );
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
  // tslint:disable-next-line: variable-name
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
            component: "FormDialogComponent",
            inputs: {
              name: this.formName,
              entityLabel: this.entityLabelSingular,
              entityName: this.entityName || this.report.entityName,
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
            component: "FormDialogComponent",
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
    // tslint:disable-next-line: variable-name
    this.selected.forEach(_id => {
      this.DashboardCommand.emit({
        command: "open-tab",
        tab: {
          title: "ویرایش " + this.title,
          active: true,
          icon: "office-paper-work-pen",
          widgets: [
            {
              component: "FormDialogComponent",
              inputs: {
                name: this.formName,
                formId: this.formId,
                entityName: this.entityName || this.report.entityName,
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
    // tslint:disable-next-line: prefer-for-of
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
    if (!this.report.data) {
      this.report.data = [];
    }
    if (this.report.data && this.report.data.length !== this.report.count) {
      if (iterate !== 0) {
        await this.refresh();
      }
      this.page = this.report.data;
    } else {
      this.page =
        _.chunk(this.report.data, this.pageSize)[this.pageIndex] || [];
    }

    this.WidgetChange.emit({ inputs: { page: this.page } });

    this.resultLoading = false;
  }
}
