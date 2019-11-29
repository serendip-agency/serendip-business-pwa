import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import * as _ from "lodash";
import { DataService } from "src/app/data.service";
@Component({
  selector: "app-form-select-input",
  templateUrl: "./form-select-input.component.html",
  styleUrls: ["./form-select-input.component.css"]
})
export class FormSelectInputComponent implements OnInit {
  _ = _;
  SelectId = `form-select-${
    Math.random()
      .toString()
      .split(".")[1]
  }`;

  @Input() selectType: "single" | "multiple" = "multiple";

  @Input() modelTrackBy;
  @Input() label: string;
  @Input() data: any;

  @Input() dataEntity;
  @Input() placeholder: string;
  @Input() labelField: string;
  @Input() valueField: string;

  @Output() modelChange = new EventEmitter<any>();

  private _model: any;

  @Input() set model(value: any) {
    this._model = value;
  }

  get model(): any {
    return this._model;
  }
  constructor(private dataService: DataService) {}

  async ngOnInit() {
    if (!this.data && this.dataEntity) {
      this.data = await this.dataService.list(this.dataEntity);
    }
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  compareObjects(o1, o2) {
    return _.isEqual(o1, o2);
  }
}
