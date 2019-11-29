import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

@Component({
  selector: "app-form-trigger-input",
  templateUrl: "./form-trigger-input.component.html",
  styleUrls: ["./form-trigger-input.component.less"]
})
export class FormTriggerInputComponent implements OnInit {
  @Output() modelChange = new EventEmitter<any>();
  @Input() model = {};

        // {
      //   componentName: "FormChipsInputComponent",
      //   propertyName: "entity",
      //   propertyType: "string",
      //   cssClass: "w-60",
      //   inputs: {
      //     entityName: "_entity",
      //     formName: "entity-form",
      //     propertiesToSearch: ["name"],
      //     propertiesSearchMode: "mix",
      //     selectType: "single",
      //     label: "Related entity"
      //   }
      // },
      
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

  ngOnInit() {}
}
