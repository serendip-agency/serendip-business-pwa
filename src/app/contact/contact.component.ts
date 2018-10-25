import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  SelectId = `contact-${Math.random().toString().split('.')[1]}`

  constructor() { }

  ngOnInit() {
  }
  trackByFn(index: any, item: any) { return index; }


  inputsChange() {
    this.modelChange.emit(this.model);
  }

  @Output() modelChange = new EventEmitter<any>();

  private _model: any[];

  @Input() set model(value: any[]) {
    this._model = value;
  }

  get model(): any[] {
    return this._model;
  }

  rpd(input) {
    if (!input) { input = ""; }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

}
