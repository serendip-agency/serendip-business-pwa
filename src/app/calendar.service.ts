import { Injectable, EventEmitter } from "@angular/core";
import * as Moment from "moment";
import * as MomentJalaali from "moment-jalaali";
import IranCalendarEvents from "./calendar/calendar.iran.events";
import * as _ from "underscore";
import { IdbService, Idb } from "./idb.service";
import { Observable } from "rxjs";
import { spawn } from "threads";

@Injectable({
  providedIn: "root"
})
export class CalendarService {
  CalendarsToShow: string[];
  public calendarVisible = true;
  public weekDays: { persian: string[]; gregorian: string[] };

  today = {
    "YYYY/MM/DD": MomentJalaali().format("YYYY/MM/DD"),
    "jYYYY/jMM/jDD": MomentJalaali().format("jYYYY/jMM/jDD")
  };

  public calendarType: "gregorian" | "persian" = "persian";
  memCache = {};
  irEventsCache = {};

  private eventsChangeEventEmitter: EventEmitter<{}>;

  subscribeToEventsChange(viewId) {
    return new Observable(obServer => {
      this.eventsChangeEventEmitter.subscribe(() => {
        obServer.next();
      });
    });
  }

  get moment() {
    return this.calendarType === "gregorian" ? Moment : MomentJalaali;
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

  async findEvents(YYYYMMDD, jYYYYjMMjDD): Promise<any[]> {
    let eventsModel = [];

    if (this.CalendarsToShow.indexOf("iran") !== -1) {
      eventsModel = eventsModel.concat(...this.irEventsCache[jYYYYjMMjDD]);
    }

    return eventsModel;
  }

  async fillDaysInMonth(
    month,
    year,
    calendarType
  ): Promise<
    {
      holiday: boolean;
      date: Date;
      class: string[];
      formats: any;
      today: boolean;
    }[]
  > {
    const cacheKey = `calendar-month-days-${calendarType}-${year}-${month}`;

    const cache = this.memCache[cacheKey];
    if (cache) {
      return cache;
    }

    if (!month || !calendarType) {
      return null;
    }

    const thread = spawn(location.origin + "/workers/calendar/daysInMonth.js");

    return new Promise((resolve, reject) => {
      thread
        .send(
          JSON.stringify({
            month,
            year,
            calendarType
          })
        )
        .on("message", monthView => {
          this.memCache[cacheKey] = monthView;

          resolve(monthView);
          thread.kill();
        })
        .on("error", e => {
          reject(e);
        });
    }).catch(e => console.log(e)) as any;
  }
}
