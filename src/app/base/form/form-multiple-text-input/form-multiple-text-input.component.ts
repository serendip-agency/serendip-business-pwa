import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
@Component({
  selector: "app-form-multiple-text-input",
  templateUrl: "./form-multiple-text-input.component.html",
  styleUrls: ["./form-multiple-text-input.component.less"]
})
export class FormMultipleTextInputComponent implements OnInit {
  SelectId = `multiple-text-${
    Math.random()
      .toString()
      .split(".")[1]
  }`;

  @Output() modelChange = new EventEmitter<any>();

  private _model: string[];

  @Input() set model(value: string[]) {
    this._model = value;
  }

  get model(): string[] {
    return this._model;
  }

  @Input() label: string;
  @Input() type: "single-line" | "multi-line";

  constructor() {}

  ngOnInit() {
    if (!this.type) {
      this.type = "single-line";
    }

    if (!this.model || (this.model && !this.model[0])) {
      this.model = [""];
      this.modelChange.emit(this.model);
    }
  }
  trackByFn(index: any, item: any) {
    return index;
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
}
