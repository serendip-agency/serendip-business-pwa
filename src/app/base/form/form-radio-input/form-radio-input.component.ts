import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-form-radio-input",
  templateUrl: "./form-radio-input.component.html",
  styleUrls: ["./form-radio-input.component.css"]
})
export class FormRadioInputComponent implements OnInit {
  trackByFn(index: any, item: any) {
    return index;
  }

  private _model: any;

  @Input()
  set model(value: any) {
    this._model = value;
  }

  get model(): any {
    return this._model;
  }

  @Input() data: { label: string; value: string }[] | string[];

  @Input() display: string;
  @Input() label: string;
  @Input() color: string;
  @Input() disabled: boolean;
  @Output() modelChange = new EventEmitter<any>();

  log(input) {
    console.log(input);
  }

  constructor() {}

  ngOnInit() {
    if (!this.model) {
      this.model = "";
    }
  }
}
