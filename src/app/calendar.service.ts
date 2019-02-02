import { Injectable, EventEmitter } from "@angular/core";
import * as Moment from "moment";
import * as MomentJalaali from "moment-jalaali";
import IranCalendarEvents from "./calendar/calendar.iran.events";
import * as _ from "underscore";
import { IdbService, Idb } from "./idb.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CalendarService {
  CalendarsToShow: string[];
  public calendarVisible = false;
  public weekDays: { persian: string[]; gregorian: string[] };

  today = {
    "YYYY/MM/DD": MomentJalaali().format("YYYY/MM/DD"),
    "jYYYY/jMM/jDD": MomentJalaali().format("jYYYY/jMM/jDD")
  };

  public calendarType: "gregorian" | "persian" = "persian";
  memCache = {};
  irEventsCache = {};
  idbCache: Idb;
  private eventsChangeEventEmitter: EventEmitter<{}>;

  subscribeToEventsChange(viewId) {
    return new Observable(obServer => {
      this.eventsChangeEventEmitter.subscribe(() => {
        obServer.next();
      });
    });
  }

  emitCalendarsChange() {
    this.eventsChangeEventEmitter.emit();
  }

  constructor(private idbService: IdbService) {
    // var promises = [];

    // for (let yi = 1396; yi <= 1400; yi++)
    //   for (let mi = 1; mi <= 12; mi++)
    //     promises.push(this.fillDaysInMonth(mi, yi, "persian"));

    // Promise.all(promises).then((months) => {
    //   //this.downloadObjectAsJson(months,"calendar.cache.json")
    // });

    MomentJalaali.loadPersian({ dialect: "persian-modern" });

    this.weekDays = {
      persian: MomentJalaali.weekdays(true),
      gregorian: Moment.weekdays()
    };

    console.log(MomentJalaali.weekdays());

    this.eventsChangeEventEmitter = new EventEmitter(true);

    IranCalendarEvents.forEach(ymRec => {
      ymRec.days.forEach(dRec => {
        const key = `${ymRec.year}/${ymRec.month
          .toString()
          .padStart(2, "0")}/${dRec.day.toString().padStart(2, "0")}`;

        let cache: any[] = this.irEventsCache[key];
        if (cache) {
          cache.push(dRec);
        } else {
          cache = [dRec];
        }

        this.irEventsCache[key] = cache;
      });
    });

    this.idbService.cacheIDB().then(_idb => {
      this.idbCache = _idb;
    });
  }

  downloadObjectAsJson(exportObj, exportName) {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  findIranEvent(year, month, day) {
    day = parseInt(day, 10);

    const _month = _.findWhere(IranCalendarEvents, {
      year: year,
      month: month
    });

    if (!_month) {
      return;
    }

    return _.where(_month.days, { day: day });
  }

  async findEvents(YYYYMMDD, jYYYYjMMjDD) {
    let eventsModel = [];

    if (this.CalendarsToShow.indexOf("iran") !== -1) {
      eventsModel = eventsModel.concat(...this.irEventsCache[jYYYYjMMjDD]);
    }

    return eventsModel;
  }

  fillDaysInMonth(
    month,
    year,
    calendarType
  ): Promise<
    {
      holiday: boolean;
      events: any[];
      date: Date;
      class: string[];
      formats: any;
    }[]
  > {
    const cacheKey = `calendar-month-days-${calendarType}-${year}-${month}`;

    return new Promise(async (resolve, reject) => {
      const cache = this.memCache[cacheKey];
      if (cache) {
        return resolve(cache);
      }

      if (!month || !calendarType) {
        return resolve();
      }

      let monthView = [];

      let moment: typeof Moment | typeof MomentJalaali;

      if (calendarType === "persian") {
        moment = MomentJalaali;
        //    moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })
      }

      if (calendarType === "gregorian") {
        moment = Moment;
      }

      let startOfTheMonth = moment(`${year}/${month}/1`, "YYYY/M/D");

      if (calendarType === "persian") {
        startOfTheMonth = moment(`j${year}/j${month}/1`, "jYYYY/jM/jD");
      }

      const startOfTheMonthWeekday = startOfTheMonth.weekday();

      let daysInMonth = startOfTheMonth.daysInMonth();

      if (calendarType === "persian") {
        daysInMonth = moment.jDaysInMonth(
          parseInt(startOfTheMonth.format("jYYYY"), 10),
          parseInt(startOfTheMonth.format("jMM"), 10) - 1
        );
      }

      const endOfMonth = moment(startOfTheMonth.toDate()).add(
        daysInMonth,
        "days"
      );

      const endOfMonthWeekday = endOfMonth.weekday();

      for (let i = startOfTheMonthWeekday; i > 0; i--) {
        monthView.push({
          date: new Date(
            parseInt(startOfTheMonth.format("x"), 10) +
              i * -1 * 1000 * 60 * 60 * 24
          ),
          class: ["prevMonth"]
        });
      }

      for (let i = 0; i < daysInMonth; i++) {
        //  var day = moment(startOfTheMonth.toDate()).add(i, 'd');
        const day = new Date(
          parseInt(startOfTheMonth.format("x"), 10) + i * 1000 * 60 * 60 * 24
        );

        //  var dayEvents = this.findIranEvent(MomentJalaali(day).jYear(), MomentJalaali(day).jMonth() + 1, i + 1);
        monthView.push({
          date: day,
          // events: dayEvents,
          // holiday: _.where(dayEvents, { holiday: true }).length > 0,
          class: ["currentMonth"]
        });
      }

      let ia = 0;
      for (let i = endOfMonthWeekday; i <= 6; i++) {
        monthView.push({
          date: new Date(
            parseInt(endOfMonth.format("x"), 10) + ia * 1000 * 60 * 60 * 24
          ),
          class: ["nextMonth"]
        });
        ia++;
      }

      const lastItem = moment(monthView[monthView.length - 1].date).format("x");
      const lastLength = monthView.length;

      for (let i = 42; i > lastLength; i--) {
        monthView.push({
          date: new Date(
            parseInt(lastItem, 10) + (43 - i) * 1000 * 60 * 60 * 24
          ),
          class: ["nextMonth"]
        });
      }

      monthView = _.map(monthView, item => {
        item.formats = {};

        const itemMoment = moment(item.date);

        ["DD", "MMMM"].forEach(f => {
          if (calendarType === "persian") {
            f = "j" + f;
            item.formats[f] = this.rpd(itemMoment.format(f));
          } else {
            item.formats[f] = itemMoment.format(f);
          }
        });

        item.formats["YYYY/MM/DD"] = itemMoment.format("YYYY/MM/DD");
        item.formats["jYYYY/jMM/jDD"] = itemMoment.format("jYYYY/jMM/jDD");

        item.today = this.today["YYYY/MM/DD"] === item.formats["YYYY/MM/DD"];

        return item;
      });

      this.memCache[cacheKey] = monthView;

      resolve(monthView);
    });
  }

  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }
}
