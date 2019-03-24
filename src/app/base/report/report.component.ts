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
import * as sUtils from "serendip-utility";
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

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.less"]
})
export class ReportComponent implements OnInit {
  fieldDragging: ReportFieldInterface;
  @Output()
  WidgetChange = new EventEmitter<DashboardWidgetInterface>();

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

  @Input() minimal: boolean;

  @Output()
  TabChange = new EventEmitter<DashboardTabInterface>();

  @Input() format: ReportFormatInterface = { options: {} };
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

  @Input() pageCount = 1;

  @Input()
  _report: ReportInterface;
  @Input() formatted: ReportInterface;
  initDone = false;
  error: any;
  _formatFields: any[];
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
    // Business related  report views
    ClubRatingViewComponent,
    ContactsViewComponent
  };

  resultLoading = false;

  constructor(
    private dashboardService: DashboardService,
    private dataService: DataService,
    private idbService: IdbService,
    private reportService: ReportService,
    private changeRef: ChangeDetectorRef,
    private calendarService: CalendarService,
    private obService: ObService
  ) {
    moment.loadPersian();
  }

  get formatFields() {
    if (this._formatFields) {
      return this._formatFields;
    }

    if (!this.report || !this.report.fields) {
      return [];
    }
    const fields = [];

    this.report.fields.forEach(item => {
      if (item.analytical) {
        fields.push({
          label: `${item.label} (${item.name})`,
          value: item
        });
      }
    });

    this._formatFields = fields;
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

    if (this.format.type === "1d") {
      this.format.method = "analyze1d";
    }

    if (this.format.type === "2d") {
      this.format.method = "analyze2d";
    }

    if (this.format.type === "3d") {
      this.format.method = "analyze3d";
    }

    if (this.format) {
      this.formatted = await this.reportService.formatReport(
        this.report,
        this.format
      );

      this.WidgetChange.emit({ inputs: { formatted: this.formatted } });
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
  modelChange() {
    this.report._id = null;
    this.report.label = null;

    this.changeRef.detectChanges();
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

  async refreshFormats() {
    this.resultLoading = true;

    this.formats = _.where(await this.dataService.list("format"), {
      entityName: this.report.entityName
    });

    const fields = this.report.fields.filter(
      p => ["_vdate", "_cdate", "_id"].indexOf(p.name) === -1
    );

    // fields.forEach(field => {
    //   this.formats.push({
    //     label: "تفکیک بر اساس کمیت " + field.label,
    //     method: "groupByFieldAndCount",
    //     options: { field },
    //     dataType: "1d"
    //   } as ReportFormatInterface);

    //   fields.forEach(field2 => {
    //     if (field.name === field2.name) {
    //       return;
    //     }
    //     this.formats.push({
    //       label: `تحلیل تغییرات ${this.entityLabelPlural ||
    //         this.title} در بازه‌های زمانی به تفکیک ${field.label} و ${
    //         field2.label
    //       }`,
    //       method: "groupByFieldAndCountOther",
    //       options: { groupBy: field2, countBy: field },
    //       dataType: "2d"
    //     } as ReportFormatInterface);
    //   });
    // });

    this.resultLoading = false;
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

    const skip = this.pageIndex * this.pageSize;

    if (!this.report && this.reportName) {
      this.report = _.findWhere(this.dashboardService.schema.reports, {
        name: this.reportName
      }) as any;
    }

    if (!this.report && this.reportId) {
      this.report = (await this.dataService.details(
        "report",
        this.reportId
      )) as any;
    }

    if (!this.entityName) {
      this.entityName = this.report.entityName;
    }

    const primaryFields = _.findWhere(this.dashboardService.schema.reports, {
      name: "primary"
    }).fields;

    primaryFields.forEach(pf => {
      if (this.report.fields.filter(f => f.name === pf.name).length === 0) {
        this.report.fields.push(pf);
      }
    });

    this.report = await this.reportService.generate(this.report);

    this.pageCount = Math.floor(this.report.count / this.pageSize);

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
      newReport = await this.dataService.update("report", reportToSave);
    } else {
      newReport = await this.dataService.insert("report", reportToSave);
    }

    this.reportId = newReport._id;

    this.report = newReport;

    await this.refreshReports();

    this.setMode("report");

    this.resultLoading = false;
  }

  async refreshReports() {
    const reportsQuery = (await this.dataService.list("report")).filter(
      p => p.entityName === this.entityName
    );

    this.reports = _.chain(reportsQuery)
      .map(item => {
        return {
          label:
            (item.label ? item.label.trim() : item._id) +
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

    console.log("change report");

    this.WidgetChange.emit({ inputs: { reportId: reportId } });

    //  await this.refresh();
  }

  async ngOnInit() {
    try {
      await this.refresh();
      await this.refreshReports();
      await this.refreshFormats();

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
          console.log("insert");
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
