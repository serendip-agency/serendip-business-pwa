import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import * as Moment from "moment";
import * as MomentJalaali from "moment-jalaali";
import { CalendarService } from "src/app/calendar.service";
import * as _ from "underscore";
import { DashboardService } from "src/app/dashboard.service";

@Component({
  selector: "app-calendar-month",
  templateUrl: "./calendar-month.component.html",
  styleUrls: ["./calendar-month.component.less"]
})
export class CalendarMonthComponent implements OnInit {
  moment: typeof Moment;

  layoutTimeout: any;

  @Input() size: "mini" | "large" | "year-month" = "large";
  @Input() showYearTitle: boolean;

  private _calendarType: "persian" | "gregorian" = "persian";

  viewId: string;
  monthView: {
    date: Date;
    class: string[];
    formats: any;
    holiday: boolean;
    today: boolean;
    events?: any[];
  }[];

  @Input() set calendarType(value: "persian" | "gregorian") {
    this._calendarType = value;

    if (this.layoutTimeout) {
      clearTimeout(this.layoutTimeout);
    }
    this.layoutTimeout = setTimeout(() => {
      this.layoutDays();
    }, 100);
  }

  get calendarType(): "persian" | "gregorian" {
    return this._calendarType;
  }

  @Input() fadeInDelay: number;

  private _month: number;

  @Input() set month(value: number) {
    if (!this._month) {
      this._month = value;
    } else {
      this._month = value;
      this.layoutDays();
    }
  }

  get month(): number {
    return this._month;
  }

  private _year: number;

  @Input() set year(value: number) {
    if (!this._year) {
      this._year = value;
    } else {
      this._year = value;

      this.layoutDays();
    }
  }

  get year(): number {
    return this._year;
  }

  constructor(
    public calendarService: CalendarService,
    public dashboardService: DashboardService,
    private changeRef: ChangeDetectorRef
  ) {}

  typeChange() {
    this.layoutDays();
  }

  getMonthName(monthNumber: number) {
    return this.calendarType === "persian"
      ? MomentJalaali("1400/" + monthNumber + "/1", "jYYYY/jM/jD").format(
          "jMMMM"
        )
      : Moment.months(monthNumber - 1);
  }

  sleep(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  async layoutDays() {
    document.getElementById(this.viewId).classList.remove("fadeIn");

    this.monthView = await this.calendarService.fillDaysInMonth(
      this.month,
      this.year,
      this.calendarType
    );

    setTimeout(
      () => {
        const view = document.getElementById(this.viewId);
        if (view) {
          view.classList.add("fadeIn");
        }
      },
      this.size === "mini" ? this.fadeInDelay || 100 + 70 * this.month : 10
    );

    this.layoutEvents()
      .then(() => {})
      .catch(() => {});
  }

  async layoutEvents() {
    this.monthView.forEach(element => {
      if (element.class.indexOf("currentMonth") !== -1) {
        this.calendarService
          .findEvents(
            element.formats["YYYY/MM/DD"],
            element.formats["jYYYY/jMM/jDD"]
          )
          .then(events => {
            element.events = events;

            element.holiday = _.findWhere(events, { holiday: true });
          });
      }
    });
  }

  async ngOnInit() {
    this.viewId = `month-view-${
      Math.random()
        .toString()
        .split(".")[1]
    }`;

    this.calendarService.subscribeToEventsChange(this.viewId).subscribe(() => {
      this.layoutEvents()
        .then(() => {})
        .catch(() => {});
    });
  }
}
