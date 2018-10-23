import { Injectable } from '@angular/core';
import * as Moment from 'moment';
import * as MomentJalaali from 'moment-jalaali';
import IranCalendarEvents from './calendar/calendar.iran.events';
import * as _ from 'underscore'
import { IdbService, Idb } from './idb.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {


  weekDays = {
    persian: MomentJalaali.weekdays(true),
    gregorian: Moment.weekdays()
  };

  today = {
    'YYYY/MM/DD': MomentJalaali().format('YYYY/MM/DD'),
    'jYYYY/jMM/jDD': MomentJalaali().format('jYYYY/jMM/jDD')
  };

  memCache = {};
  irEventsCache = {};
  idbCache: Idb;

  constructor(private idbService: IdbService) {

    // var promises = [];

    // for (let yi = 1396; yi <= 1400; yi++)
    //   for (let mi = 1; mi <= 12; mi++)
    //     promises.push(this.fillDaysInMonth(mi, yi, "persian"));

    // Promise.all(promises).then((months) => {
    //   //this.downloadObjectAsJson(months,"calendar.cache.json")
    // }); 

    IranCalendarEvents.forEach((ymRec) => {

      ymRec.days.forEach((dRec) => {

        var key = `${ymRec.year}/${ymRec.month.toString().padStart(2, '0')}/${dRec.day.toString().padStart(2, '0')}`;

        var cache: any[] = this.irEventsCache[key];
        if (cache)
          cache.push(dRec);
        else
          cache = [dRec];

        this.irEventsCache[key] = cache;

      });

    });

    console.log(this.irEventsCache);



    new Promise(async (resolve, reject) => {
      this.idbCache = await this.idbService.cacheIDB();
      resolve();
    });
  }

  downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }


  findIranEvent(year, month, day) {

    day = parseInt(day);

    var _month = _.findWhere(IranCalendarEvents, { year: year, month: month });

    if (!_month)
      return;

    return _.where(_month.days, { day: day });

  }

  async findEvents(YYYYMMDD, jYYYYjMMjDD) {

    return this.irEventsCache[jYYYYjMMjDD];

  }

  fillDaysInMonth(month, year, calendarType): Promise<{ holiday: boolean, events: any[], date: Date, class: string[], formats: any }[]> {

    console.log("fillDaysInMonth", month, year, calendarType);

    var cacheKey = `calendar-month-days-${calendarType}-${year}-${month}`;

    return new Promise(async (resolve, reject) => {

      var cache = this.memCache[cacheKey];
      if (cache)
        return resolve(cache);


      if (!month || !calendarType)
        return resolve();

      var monthView = [];

      var moment: typeof Moment;

      if (calendarType == "persian") {
        moment = MomentJalaali;
        //    moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })
      }

      if (calendarType == "gregorian")
        moment = Moment;


      var startOfTheMonth = moment(`${year}/${month}/1`, "YYYY/M/D");

      if (calendarType == "persian")
        startOfTheMonth = moment(`j${year}/j${month}/1`, "jYYYY/jM/jD");

      var startOfTheMonthWeekday = startOfTheMonth.weekday();

      var daysInMonth = startOfTheMonth.daysInMonth();

      if (calendarType == "persian")
        daysInMonth = moment.jDaysInMonth(parseInt(startOfTheMonth.format('jYYYY')), parseInt(startOfTheMonth.format('jMM')) - 1);


      var endOfMonth = moment(startOfTheMonth.toDate()).add(daysInMonth, 'days');

      var endOfMonthWeekday = endOfMonth.weekday();

      for (let i = startOfTheMonthWeekday; i > 0; i--) {

        monthView.push({
          date: new Date(parseInt(startOfTheMonth.format('x')) + i * -1 * 1000 * 60 * 60 * 24),
          class: ['prevMonth']
        });

      }


      for (let i = 0; i < daysInMonth; i++) {
        //  var day = moment(startOfTheMonth.toDate()).add(i, 'd');
        var day = new Date(parseInt(startOfTheMonth.format('x')) + i * 1000 * 60 * 60 * 24);

        //  var dayEvents = this.findIranEvent(MomentJalaali(day).jYear(), MomentJalaali(day).jMonth() + 1, i + 1);
        monthView.push({
          date: day,
          //events: dayEvents,
          //holiday: _.where(dayEvents, { holiday: true }).length > 0,
          class: ['currentMonth']
        });

      }


      var ia = 0;
      for (let i = endOfMonthWeekday; i <= 6; i++) {
        monthView.push({
          date: new Date(parseInt(endOfMonth.format('x')) + ia * 1000 * 60 * 60 * 24),
          class: ['nextMonth']
        });
        ia++;
      }

      monthView = _.map(monthView, (item) => {

        item.formats = {};

        var itemMoment = moment(item.date);

        ['DD', 'MMMM'].forEach((f) => {
          if (calendarType == "persian") {
            f = 'j' + f;
            item.formats[f] = this.rpd(itemMoment.format(f));
          } else {
            item.formats[f] = itemMoment.format(f);
          }
        });

        item.formats['YYYY/MM/DD'] = itemMoment.format('YYYY/MM/DD');
        item.formats['jYYYY/jMM/jDD'] = itemMoment.format('jYYYY/jMM/jDD');

        item.today = this.today["YYYY/MM/DD"] == item.formats['YYYY/MM/DD'];

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
