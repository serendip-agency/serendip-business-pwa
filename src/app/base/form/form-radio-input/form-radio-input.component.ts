import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import * as sUtil from "serendip-utility";

@Component({
  selector: "app-form-radio-input",
  templateUrl: "./form-radio-input.component.html",
  styleUrls: ["./form-radio-input.component.css"]
})
export class FormRadioInputComponent implements OnInit {
  stringify = JSON.stringify;

  public sUtil = sUtil;

  @Input()
  public model: any;

  @Input() data: { label: string; value: string }[] | string[];

  @Input() display: string;
  @Input() label: string;
  @Input() color: string;
  @Input() disabled: boolean;
  @Output() modelChange = new EventEmitter<any>();
  trackByFn(index: any, item: any) {
    return index;
  }
  log(input) {
    console.log(input);
  }
  typeof(obj) {
    return typeof obj;
  }

  constructor() {}

  ngOnInit() {
    if (!this.model) {
      this.model = "";
    }
  }
}
