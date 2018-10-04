import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment-jalaali'

import * as sUtil from 'serendip-utility';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {
  moment: typeof Moment;

  monthView = [];

  calendarType: "islamic" | "persian" | 'gregorian' = "persian";
  constructor() {

    this.moment = Moment;
    this.moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })


    var startOfTheMonth = this.moment(this.moment().format("jYYYY/jM/1"), "jYYYY/jM/jD").add(-1, 'month').toDate();
    var startOfTheMonthWeekday = this.moment(startOfTheMonth).weekday();

    var daysInMonth = this.moment.jDaysInMonth(parseInt(this.moment(startOfTheMonth).format('jYYYY')), parseInt(this.moment(startOfTheMonth).format('jMM')) - 1);
    var endOfMonth = this.moment(startOfTheMonth).add(daysInMonth, 'days').toDate();
    var endOfMonthWeekday = this.moment(endOfMonth).weekday();

   //console.log(this.moment(startOfTheMonth).weekday(), daysInMonth);

    for (let i = startOfTheMonthWeekday; i > 0; i--) {

      this.monthView.push({
        moment: this.moment(startOfTheMonth).add(i * -1, 'd'),
        class: ['prevMonth']
      });

    }

    for (let i = 0; i < daysInMonth; i++) {

      this.monthView.push({
        moment: this.moment(startOfTheMonth).add(i, 'd'),

        class: ['currentMonth']
      });

    }


    for (let i = endOfMonthWeekday; i <= 6; i++) {

      this.monthView.push({
        moment: this.moment(endOfMonth).add(i, 'd'),
        class: ['nextMonth']
      });

    }


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





  }

}
