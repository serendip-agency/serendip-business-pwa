import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import * as Moment from 'moment'
import * as MomentJalaali from 'moment-jalaali'

import * as sUtil from 'serendip-utility';
import * as _ from 'underscore'
import IranCalendarEvents from '../calendar.iran.events';


@Component({
  selector: 'app-calendar-year',
  templateUrl: './calendar-year.component.html',
  styleUrls: ['./calendar-year.component.less']
})
export class CalendarYearComponent implements OnInit {



  private _month: number;

  @Input() set month(value: number) {

    this._month = value;
   // this.layoutMonths();

  }

  get month(): number {

    return this._month;

  }


  private _year: number;

  @Input() set year(value: number) {

    this._year = value;
   // this.layoutMonths();
  }

  get year(): number {

    return this._year;

  }



  moment: typeof Moment;
  yearView = [];

  @Input() size: "mini" | "large" = "large";



  private _calendarType: "persian" | 'gregorian' = "persian";

  @Input() set calendarType(value: "persian" | 'gregorian') {

    this._calendarType = value;
 //   this.layoutMonths();

  }

  get calendarType(): "persian" | 'gregorian' {

    return this._calendarType;

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

  // layoutMonths() {

  //   this.yearView = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number, index) => {
  //     return { label: this.calendarType == "persian" ? MomentJalaali('1400/' + number + '/1', 'jYYYY/jM/jD').format('jMMMM') :  Moment.months(index),number }
  //   });

  // }


  ngOnInit() {

 //  this.layoutMonths();

  }

}
