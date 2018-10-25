import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-company-type-select',
  templateUrl: './company-type-select.component.html',
  styleUrls: ['./company-type-select.component.css']
})
export class CompanyTypeSelectComponent implements OnInit {

  SelectId = `contact-postalcode-${Math.random().toString().split('.')[1]}`

  constructor() { }

  ngOnInit() {
  }
  trackByFn(index: any, item: any) { return index; }


  @Output() modelChange = new EventEmitter<any>();

  private _model: string;

  @Input() set model(value: string) {
    this._model = value;
  }

  get model(): string {
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
