
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-checkbox-input',
  templateUrl: './form-checkbox-input.component.html',
  styleUrls: ['./form-checkbox-input.component.css']
})
export class FormCheckboxInputComponent implements OnInit {

  trackByFn(index: any, item: any) { return index; }


  private _model: any;

  @Input() set model(value: any) {
    this._model = value;
  }

  get model():   any {

    if (this._model) {
    return this._model;
    } else
    if (this.data) {
    this._model = [];
    } else {
    this._model = false;
    }

    return this._model;
  }


  @Input() data: { label: string, value: string }[] | string[];


  @Input() label: string;
  @Input() color: string;
  @Input() disabled: boolean;
  @Output() modelChange = new EventEmitter<any>();



  checkboxInArrayChange(event: { checked: boolean }, item: any | { label: string, value: string } | string, index: number) {

// 

    if (!this.model) {
      this.model = [];
    }

    if (!event.checked) {
      if (this.model.indexOf(item.value  || item) !== -1) {
        this.model.splice(this.model.indexOf(item.value || item), 1);
      }
    }


    if (event.checked) {
      this.model.push(item.value  || item);
    }


    this.modelChange.emit(this.model);


  }


  log(input) {
    
  }

  constructor() { }

  ngOnInit() {



  }

}
