
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import * as Moment from 'moment'
import * as MomentJalaali from 'moment-jalaali'


@Component({
  selector: 'app-calendar-input',
  templateUrl: './calendar-input.component.html',
  styleUrls: ['./calendar-input.component.less']
})
export class CalendarInputComponent implements OnInit {

  SelectId = `contact-${Math.random().toString().split('.')[1]}`

  moment = Moment;
  momentJalaali = MomentJalaali;

  @Input() label: string;
  @Input() calendarType: string;
  dateHelpers = false;
  timeHelpers = false;

  constructor() {

  }

  ngOnInit() {

  }
  trackByFn(index: any, item: any) { return index; }


  inputsChange() {
    this.modelChange.emit(this.model);
    this.model = this.model;
  }

  @Output() modelChange = new EventEmitter<any>();

  public _model: {
    date: string,
    time: string
  } = { date: '', time: '' }

  @Input() set model(value: Date) {

    if (!value)
      return;

    if (this.calendarType == 'persian')
      this._model = {
        date: MomentJalaali(value).format('jYYYY/jMM/jDD'),
        time: MomentJalaali(value).format('HH:mm:ss')
      };
    else
      this._model = {
        date: MomentJalaali(value).format('YYYY/MM/DD'),
        time: MomentJalaali(value).format('HH:mm:ss')
      }
  }

  get model(): Date {

    if (this.calendarType == 'persian')
      return MomentJalaali(this._model.date + ' ' + this._model.time, 'jYYYY/jMM/jDD HH:mm:ss').toDate();
    else
      return Moment(this._model.date + ' ' + this._model.time, 'YYYY/MM/DD HH:mm:ss').toDate();
  }

  rpd(input) {
    if (!input) { input = ""; }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

}
