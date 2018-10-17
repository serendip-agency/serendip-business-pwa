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

  @Input() calendarType: "persian" | 'gregorian' = "persian";


  private _month: number;

  @Input() set month(value: number) {

    this._month = value;
    this.layoutDays();

  }

  get month(): number {

    return this._month;

  }


  private _year: number;

  @Input() set year(value: number) {

    this._year = value;
    this.layoutDays();
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

  layoutDays() {


    this.monthView = [];

    console.log("layoutDays", this.calendarType, this.month);

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

    console.log(endOfMonthWeekday, moment.weekdays(true, endOfMonthWeekday));
    //console.log(moment(startOfTheMonth).weekday(), daysInMonth);

    for (let i = startOfTheMonthWeekday; i > 0; i--) {

      this.monthView.push({
        moment: moment(startOfTheMonth).add(i * -1, 'd'),
        class: ['prevMonth']
      });

    }


    for (let i = 0; i < daysInMonth; i++) {
      var day = moment(startOfTheMonth).add(i, 'd');
      var dayEvents = this.findIranEvent(MomentJalaali(day).jYear(), MomentJalaali(day).jMonth() + 1, i + 1);
      this.monthView.push({
        moment: day,
        events: dayEvents,
        holiday: _.where(dayEvents, { holiday: true }).length > 0,
        class: ['currentMonth']
      });

    }


    var ia = 0;
    for (let i = endOfMonthWeekday; i <= 6; i++) {

      console.log(endOfMonthWeekday, ia)
      this.monthView.push({
        moment: moment(endOfMonth).add(ia, 'd'),
        class: ['nextMonth']
      });

      ia++;

    }

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
