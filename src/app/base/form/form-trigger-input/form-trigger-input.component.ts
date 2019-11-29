import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

@Component({
  selector: "app-form-trigger-input",
  templateUrl: "./form-trigger-input.component.html",
  styleUrls: ["./form-trigger-input.component.less"]
})
export class FormTriggerInputComponent implements OnInit {
  @Output() modelChange = new EventEmitter<any>();
  @Input() model: any;

  types = [
    {
      label: "On document insert",
      value: "insert"
    },
    {
      label: "On document update",
      value: "update"
    },
    {
      label: "On document delete",
      value: "delete"
    },
    {
      label: "at a specific date",
      value: "date"
    },
    {
      label: "timer",
      value: "timer"
    }
  ];

  constructor() {}

  log(input) {
    console.log(input);
  }
  ngOnInit() {
    this.modelChange.emit(
      this.model || {
        type: "",
        entity: ""
      }
    );
  }
}
