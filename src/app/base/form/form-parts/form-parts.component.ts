import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormPartInterface } from "serendip-business-model";
import { ContactInputComponent } from "src/app/crm/contact-input/contact-input.component";
import { formPartTemplates } from "src/app/schema/formPartTemplates";
import * as _ from "underscore";

import { FormAutoCompleteInputComponent } from "../form-auto-complete-input/form-auto-complete-input.component";
import { FormCheckboxInputComponent } from "../form-checkbox-input/form-checkbox-input.component";
import { FormChipsInputComponent } from "../form-chips-input/form-chips-input.component";
import { FormCityInputComponent } from "../form-city-input/form-city-input.component";
import { FormCountryInputComponent } from "../form-country-input/form-country-input.component";
import { FormDateInputComponent } from "../form-date-input/form-date-input.component";
import { FormFileInputComponent } from "../form-file-input/form-file-input.component";
import { FormIconInputComponent } from "../form-icon-input/form-icon-input.component";
import { FormLatlngInputComponent } from "../form-latlng-input/form-latlng-input.component";
import { FormMobileInputComponent } from "../form-mobile-input/form-mobile-input.component";
import { FormMultipleTextInputComponent } from "../form-multiple-text-input/form-multiple-text-input.component";
import { FormPriceInputComponent } from "../form-price-input/form-price-input.component";
import { FormRadioInputComponent } from "../form-radio-input/form-radio-input.component";
import { FormRelativeDateInputComponent } from "../form-relative-date-input/form-relative-date-input.component";
import { FormSelectInputComponent } from "../form-select-input/form-select-input.component";
import { FormStateInputComponent } from "../form-state-input/form-state-input.component";
import { FormTelephoneInputComponent } from "../form-telephone-input/form-telephone-input.component";
import { FormTextInputComponent } from "../form-text-input/form-text-input.component";
import { FormToggleInputComponent } from "../form-toggle-input/form-toggle-input.component";
import { FormCodeInputComponent } from "../form-code-input/form-code-input.component";
import { FormStorageInputComponent } from "../form-storage-input/form-storage-input.component";

@Component({
  selector: "app-form-parts",
  templateUrl: "./form-parts.component.html",
  styleUrls: ["./form-parts.component.css"]
})
export class FormPartsComponent implements OnInit {
  @Input() public model: any;

  @Input() public document: any;
  @Input() public WidgetChange: any;
  @Input() public formSchema: any;
  private DynamicParts = {
    FormTextInputComponent,
    FormMultipleTextInputComponent,
    FormPriceInputComponent,
    FormMobileInputComponent,
    FormTelephoneInputComponent,
    FormCityInputComponent,
    FormCountryInputComponent,
    FormStateInputComponent,
    FormLatlngInputComponent,
    FormChipsInputComponent,
    FormSelectInputComponent,
    FormCheckboxInputComponent,
    FormRadioInputComponent,
    FormToggleInputComponent,
    FormAutoCompleteInputComponent,
    ContactInputComponent,
    FormDateInputComponent,
    FormRelativeDateInputComponent,
    FormFileInputComponent,
    FormIconInputComponent,
    FormCodeInputComponent,
    FormStorageInputComponent
  };
  constructor(public ref: ChangeDetectorRef) {}
  filterParts(parts: FormPartInterface[]) {
    if (!parts) {
      return [];
    }

    parts.forEach(part => {
      if (typeof this.model !== "object") {
        return;
      }
      if (part.propertyType === "array") {
        if (
          !this.model[part.propertyName] ||
          (this.model[part.propertyName] &&
            this.model[part.propertyName].length &&
            this.model[part.propertyName].length === 0)
        ) {
          this.model[part.propertyName] = [{}];
        }
      }

      if (part.propertyType === "object" && !this.model[part.propertyName]) {
        this.model[part.propertyName] = {};
      }
    });
    parts = parts.map(part => {
      if (part.templateName && formPartTemplates[part.templateName]) {
        part.inputs = _.extend(
          formPartTemplates[part.templateName].inputs,
          part.inputs
        );
        part = _.extend(formPartTemplates[part.templateName], part);
      }
      return part;
    });

    return parts.filter(part => {
      if (part.if) {
        let evalResult = false;

        try {
          // tslint:disable-next-line:no-eval
          evalResult = eval(
            part.if.replace(/\^form/g, "(" + JSON.stringify(this.model) + ")")
          );
        } catch (error) {}

        return evalResult;
      }
      return true;
    });
  }

  extendObj(obj1, obj2) {
    return _.extend(obj1, obj2);
  }

  dynamicPartModelChange(property, subProperty, subPropertyIndexInArray) {
    return newValue => {
      console.log("form property change", property, subProperty, newValue);

      if (!subProperty) {
        this.model[property] = newValue;
      } else {
        if (subProperty && typeof subPropertyIndexInArray === "undefined") {
          if (!this.model[property]) {
            this.model[property] = {};
          }
          this.model[property][subProperty] = newValue;
        } else {
          if (!this.model[property]) {
            this.model[property] = [];
          }

          this.model[property][subPropertyIndexInArray][subProperty] = newValue;
        }
      }

      this.WidgetChange.emit({
        inputs: {
          model: this.model
        }
      });
      this.detectChange();
    };
  }
  async detectChange() {
    if (this.ref) {
      this.ref.detectChanges();
    }

    if (this.WidgetChange) {
      this.WidgetChange.emit({ inputs: { model: this.model } });
    }
  }
  getDynamicPart(componentName) {
    return this.DynamicParts[componentName];
  }
  ngOnInit() {
    if (!this.document && this.model) {
      this.document = this.model;
    }
  }
}
