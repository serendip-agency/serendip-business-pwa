import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-form-text-input",
  templateUrl: "./form-text-input.component.html",
  styleUrls: ["./form-text-input.component.css"]
})
export class FormTextInputComponent implements OnInit {
  SelectId = `text-${
    Math.random()
      .toString()
      .split(".")[1]
    }`;

  @Input() multiline = false;
  @Input() type = 'text';

  @Input() dir;

  private _model: string;

  @Input() set model(value: string) {
    this._model = value;
  }

  get model(): string {
    return this._model;
  }

  @Input() label: string;
  @Output() modelChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

  }

  inputsChange() {
    this.modelChange.emit(this.model);
  }

  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }
  log(input) {
    
  }
}
