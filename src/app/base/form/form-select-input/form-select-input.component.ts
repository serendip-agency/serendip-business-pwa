
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

  private _model: any;

  @Input() set model(value: any) {
    this._model = value;
  }

  get model(): any {
    return this._model;
  }

  compareObjects(o1,o2){
    if(!o1,!o2){
      return false
    }

    try {
      return JSON.stringify(o1) === JSON.stringify(o2)
    } catch (error) {
      return false;
    }

  }
  rpd(input) {
    if (!input) { input = ""; }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

}
