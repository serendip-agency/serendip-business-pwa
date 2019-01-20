import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-form-toggle-input",
  templateUrl: "./form-toggle-input.component.html",
  styleUrls: ["./form-toggle-input.component.css"]
})
export class FormToggleInputComponent implements OnInit {
  private _model: boolean;

  @Input() set model(value: boolean) {
    this._model = value;
  }

  get model(): boolean {
    return this._model;
  }

  @Input() label: string;
  @Input() color: string;
  @Input() disabled: boolean;
  @Output() modelChange = new EventEmitter<any>();

  log(input) {
    console.log(input);
  }
  constructor() {}

  ngOnInit() {}
}
