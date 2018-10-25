import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-telephones-input',
  templateUrl: './telephones-input.component.html',
  styleUrls: ['./telephones-input.component.css']
})
export class TelephonesInputComponent implements OnInit {

  SelectId = `contact-telephones-${Math.random().toString().split('.')[1]}`


  constructor() { }

  ngOnInit() {
  }
  trackByFn(index: any, item: any) { return index; }


  @Output() modelChange = new EventEmitter<any>();

  private _model: string[];

  @Input() set model(value: string[]) {
    this._model = value;
  }

  get model(): string[] {
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
