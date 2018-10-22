import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Moment from 'moment'
import * as MomentJalaali from 'moment-jalaali'

import * as sUtil from 'serendip-utility';
import * as _ from 'underscore'


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {

  moment: typeof Moment;

  monthView = [];
  calendarView = "year";
  date;

  calendarType: "persian" | 'gregorian' = "persian";



  constructor(private changeRef: ChangeDetectorRef) {

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

  typeChange(){

  }

  nextMonth() {
    this.date.add(1, 'month');
    this.changeRef.detectChanges();
  }

  prevMonth() {
    this.date.add(-1, 'month');
    this.changeRef.detectChanges();
  }


  nextYear() {
    this.date.add(1, 'year');
    this.changeRef.detectChanges();
  }

  prevYear() {
    this.date.add(-1, 'year');
    this.changeRef.detectChanges();
  }


  
  ngOnInit() {


    this.moment = MomentJalaali;
    this.moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

    this.date = this.moment();
  }

}
