
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-form-select-input',
  templateUrl: './form-select-input.component.html',
  styleUrls: ['./form-select-input.component.css']
})
export class FormSelectInputComponent implements OnInit {

  SelectId = `form-select-${Math.random().toString().split('.')[1]}`

  constructor() { }

  ngOnInit() {
  }
  trackByFn(index: any, item: any) { return index; }

  
  @Input() selectType: 'single' | 'multiple' = 'multiple';

  @Input() label: string;
  @Input() data: any;

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
