import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WidgetCommandInterface } from 'src/app/models';

import { validate } from 'serendip-utility';

import * as Moment from 'moment'
import * as MomentJalaali from 'moment-jalaali'

@Component({
  selector: 'app-date-view',
  templateUrl: './date-view.component.html',
  styleUrls: ['./date-view.component.less']
})
export class DateViewComponent implements OnInit {

  constructor() { }


  @Output() widgetCommand: EventEmitter<WidgetCommandInterface> = new EventEmitter<WidgetCommandInterface>();



  @Input() calendarType: "persian" | 'gregorian' = "persian";
  @Input() format = 'YYYY/MM/DD';
  @Input() viewType: string;
  @Input() label: any;

  private _model: any;
  public get model(): any {
    return this._model;
  }
  public set model(v: any) {

    if (v)
      if (validate.isNumeric(v)) {
        this._model = MomentJalaali(new Date(v)).format(this.format);
      } else {
        this._model = MomentJalaali(v).format(this.format);
      }

  }


  ngOnInit() {



  }

}
