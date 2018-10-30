


import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-form-text-input',
  templateUrl: './form-text-input.component.html',
  styleUrls: ['./form-text-input.component.css']
})
export class FormTextInputComponent implements OnInit {

  SelectId = `text-${Math.random().toString().split('.')[1]}`;

  @Input() type: 'single-line' | 'multi-line';

  @Input() label: string;

  constructor() { }

  ngOnInit() {

    if (!this.type)
      this.type = "single-line";

  }

  inputsChange() {
    this.modelChange.emit(this.model);
  }

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
  log(input) {
    console.log(input);

  }
}
