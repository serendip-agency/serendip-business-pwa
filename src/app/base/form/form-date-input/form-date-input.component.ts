import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef
} from "@angular/core";

import * as Moment from "moment";
import * as MomentJalaali from "moment-jalaali";
import * as _ from "underscore";
import { CalendarService } from "src/app/calendar.service";

@Component({
  selector: "app-form-date-input",
  templateUrl: "./form-date-input.component.html",
  styleUrls: ["./form-date-input.component.less"]
})
export class FormDateInputComponent implements OnInit {
  @Output() modelChange = new EventEmitter<any>();

  public _model: {
    date: string;
    time: string;
  } = { date: "", time: "" };

  @Input()
  set model(value: Date) {
    if (!value) {
      return;
    }

    if (this.calendarType === "persian") {
      this._model = {
        date: MomentJalaali(value).format("jYYYY/jMM/jDD"),
        time: MomentJalaali(value).format("HH:mm:ss")
      };
    } else {
      this._model = {
        date: MomentJalaali(value).format("YYYY/MM/DD"),
        time: MomentJalaali(value).format("HH:mm:ss")
      };
    }
  }

  get model(): Date {
    if (!this._model.date && !this._model.time) {
      return null;
    }

    if (this._model.date && !this._model.time) {
      this._model.time = "00:00:00";
    }

    if (this.calendarType === "persian") {
      return MomentJalaali(
        this._model.date + " " + this._model.time,
        "jYYYY/jMM/jDD HH:mm:ss"
      ).toDate();
    } else {
      return Moment(
        this._model.date + " " + this._model.time,
        "YYYY/MM/DD HH:mm:ss"
      ).toDate();
    }
  }

  SelectId = `contact-${
    Math.random()
      .toString()
      .split(".")[1]
  }`;

  moment = Moment;
  momentJalaali = MomentJalaali;

  @Input() label: string;

  set calendarType(v: string) {}
  get calendarType(): string {
    return this.calendarService.calendarType;
  }

  dateHelpers = false;
  timeHelpers = false;

  constructor(
    public changeRef: ChangeDetectorRef,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {}
  trackByFn(index: any, item: any) {
    return index;
  }

  inputsChange($event?) {
    this.modelChange.emit(this.model);
    this.changeRef.detectChanges();
  }
  timeHelperClick() {
    console.log(this.model);
    if (!this.model) {
      this.model = new Date();
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
}
