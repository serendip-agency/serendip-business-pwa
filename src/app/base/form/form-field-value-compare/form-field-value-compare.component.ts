import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormInterface } from "serendip-business-model";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-form-field-value-compare",
  templateUrl: "./form-field-value-compare.component.html",
  styleUrls: ["./form-field-value-compare.component.css"]
})
export class FormFieldValueCompareComponent implements OnInit {
  @Output() modelChange = new EventEmitter<any>();

  @Input() model: {
    compareType: string;
    field: string;
  };
  fieldsToSelect: any[];

  compareTypes = [
    {
      label: "پر شده باشد",
      value: "filled"
    },
    {
      label: "خالی شده باشد",
      value: "unfilled"
    },
    {
      label: "تغییر پیدا کرده باشد",
      value: "changed"
    },
    {
      label: "از مقدار مشخصی تغییر پیدا کرده باشد",
      value: "changedFrom"
    },
    {
      label: "به مقدار مشخصی تغییر پیدا کرده باشد",
      value: "changedTo"
    },
    {
      label: "از مقدار مشخصی به مقدار مشخصی تغییر پیدا کرده باشد",
      value: "changedFromTo"
    }
  ];
  @Input() formModel: any;
  @Input() form: FormInterface;
  constructor(private dataService: DataService) {}

  async ngOnInit() {
    if (this.formModel.formId) {
      this.form = (await this.dataService.details(
        "form",
        this.formModel.formId
      )) as any;

      this.fieldsToSelect = this.form.parts
        .filter(p => p.propertyType !== "array" && p.propertyType !== "object")
        .map(p => {
          return {
            label:
              p.label ||
              (p.inputs ? p.inputs.label || p.propertyName : p.propertyName),
            value: p.propertyName
          };
        });
    }
  }
}
