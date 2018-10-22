import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import * as Moment from 'moment'
import * as MomentJalaali from 'moment-jalaali'

import * as sUtil from 'serendip-utility';
import * as _ from 'underscore'
import IranCalendarEvents from '../calendar.iran.events';

@Component({
  selector: 'app-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.less']
})
export class CalendarMonthComponent implements OnInit {


  moment: typeof Moment;
  monthView = [];

  @Input() size: "mini" | "large" = "large";


  private _calendarType: "persian" | 'gregorian' = "persian";

  @Input() set calendarType(value: "persian" | 'gregorian') {

    this._calendarType = value;
    this.layoutDays();

  }

  get calendarType(): "persian" | 'gregorian' {

    return this._calendarType;

  }



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


  findIranEvent(year, month, day) {

    day = parseInt(day);

    var _month = _.findWhere(IranCalendarEvents, { year: year, month: month });

    if (!_month)
      return;

    return _.where(_month.days, { day: day });

  }

  constructor(private changeRef: ChangeDetectorRef) {

    this.moment = MomentJalaali;
    this.moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

  }

  typeChange() {
    this.layoutDays();
  }

  async layoutDays() {

    if (!this.month || !this.calendarType)
      return;


    var cacheKey = `cache-calendar-layoutDays-${this.calendarType}-${this.year}-${this.month}`;
   var cache = localStorage.getItem(cacheKey);
  //   var cache = false;

    if (cache) {
      this.monthView = JSON.parse(cache);
      return;
    }
    else
      this.monthView = [];

    console.log("layoutDays", this.calendarType, this.year, this.month);

    // this.moment = MomentJalaali;

    var moment: typeof Moment;

    if (this.calendarType == "persian") {
      moment = MomentJalaali;
      moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })
    }

    if (this.calendarType == "gregorian")
      moment = Moment;

    //.add(-1, 'month')

    if (!this.month)
      moment().month();

    var startOfTheMonth = moment(moment().format(`${this.year}/${this.month}/1`), "YYYY/M/D").toDate();

    if (this.calendarType == "persian")
      startOfTheMonth = moment(moment().format(`j${this.year}/j${this.month}/1`), "jYYYY/jM/jD").toDate();

    var startOfTheMonthWeekday = moment(startOfTheMonth).weekday();

    var daysInMonth = moment(startOfTheMonth).daysInMonth();

    if (this.calendarType == "persian")
      daysInMonth = moment.jDaysInMonth(parseInt(moment(startOfTheMonth).format('jYYYY')), parseInt(moment(startOfTheMonth).format('jMM')) - 1);


    var endOfMonth = moment(startOfTheMonth).add(daysInMonth, 'days').toDate();

    var endOfMonthWeekday = moment(endOfMonth).weekday();

    //    console.log(endOfMonthWeekday, moment.weekdays(true, endOfMonthWeekday));
    //console.log(moment(startOfTheMonth).weekday(), daysInMonth);

    for (let i = startOfTheMonthWeekday; i > 0; i--) {

      this.monthView.push({
        date: moment(startOfTheMonth).add(i * -1, 'd').toDate(),
        class: ['prevMonth']
      });

    }


    for (let i = 0; i < daysInMonth; i++) {
      var day = moment(startOfTheMonth).add(i, 'd');
      var dayEvents = this.findIranEvent(MomentJalaali(day).jYear(), MomentJalaali(day).jMonth() + 1, i + 1);
      this.monthView.push({
        date: day.toDate(),
        events: dayEvents,
        today: day.format('YYYY-MM-DD') == moment().format('YYYY-MM-DD'),
        holiday: _.where(dayEvents, { holiday: true }).length > 0,
        class: ['currentMonth']
      });
    }


    var ia = 0;
    for (let i = endOfMonthWeekday; i <= 6; i++) {

      ///console.log(endOfMonthWeekday, ia)
      this.monthView.push({
        date: moment(endOfMonth).add(ia, 'd').toDate(),
        class: ['nextMonth']
      });

      ia++;

    }



    this.monthView = _.map(this.monthView, (item) => {

      item.formats = {};

      ['DD', 'MMMM'].forEach((f) => {

        if (this.calendarType == "persian")
          f = 'j' + f;

        item.formats[f] = moment(item.date).format(f);

      });

      return item;

    });

    localStorage.setItem(cacheKey, JSON.stringify(this.monthView));

    this.changeRef.detectChanges();

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


  ngOnInit() {


    this.layoutDays();


  }

}
