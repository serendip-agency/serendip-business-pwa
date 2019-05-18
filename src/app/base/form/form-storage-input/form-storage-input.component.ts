import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { EntityModel } from "serendip-business-model";

@Component({
  selector: "app-form-storage-input",
  templateUrl: "./form-storage-input.component.html",
  styleUrls: ["./form-storage-input.component.less"]
})
export class FormStorageInputComponent implements OnInit {
  private _model: string;

  @Input() set model(value: string) {
    this._model = value;
  }

  get model(): string {
    return this._model;
  }

  @Input() selectActive = false;
  @Input() document: EntityModel;
  @Input() label: string;
  @Output() modelChange = new EventEmitter<any>();

  @Input() selectType = "single";

  constructor() {}

  onSelect(selectedPaths) {
    if (this.selectType === "single") {
      if (selectedPaths && selectedPaths[0]) {
        this.model = selectedPaths[0];
      }
    } else {
      this.model = selectedPaths;
    }

    this.modelChange.emit(this.model);
    this.selectActive = false;
  }
  ngOnInit() {}

  typeof(val) {
    return typeof val;
  }
  inputsChange() {
    this.modelChange.emit(this.model);
  }

  log(input) {
    
  }
}
