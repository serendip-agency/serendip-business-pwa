import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { DataService } from "../../data.service";
import * as _ from "underscore";
import { IdbService, Idb } from "../../idb.service";

import { FormTextInputComponent } from "./form-text-input/form-text-input.component";
import { FormPriceInputComponent } from "./form-price-input/form-price-input.component";
import { FormMobileInputComponent } from "./form-mobile-input/form-mobile-input.component";
import { FormTelephoneInputComponent } from "./form-telephone-input/form-telephone-input.component";
import { FormCityInputComponent } from "./form-city-input/form-city-input.component";
import { FormCountryInputComponent } from "./form-country-input/form-country-input.component";
import { FormStateInputComponent } from "./form-state-input/form-state-input.component";
import { FormLatlngInputComponent } from "./form-latlng-input/form-latlng-input.component";
import { FormChipsInputComponent } from "./form-chips-input/form-chips-input.component";
import { FormSelectInputComponent } from "./form-select-input/form-select-input.component";
import { FormCheckboxInputComponent } from "./form-checkbox-input/form-checkbox-input.component";
import { FormRadioInputComponent } from "./form-radio-input/form-radio-input.component";
import { FormAutoCompleteInputComponent } from "./form-auto-complete-input/form-auto-complete-input.component";
import { FormToggleInputComponent } from "./form-toggle-input/form-toggle-input.component";
import { FormMultipleTextInputComponent } from "./form-multiple-text-input/form-multiple-text-input.component";
import { HttpClient } from "@angular/common/http";
import { ContactInputComponent } from "src/app/crm/contact-input/contact-input.component";
import { DashboardService } from "src/app/dashboard.service";
import { FormDateInputComponent } from "./form-date-input/form-date-input.component";
import { FormRelativeDateInputComponent } from "./form-relative-date-input/form-relative-date-input.component";
import {
  DashboardTabInterface,
  DashboardWidgetInterface,
  FormPartInterface,
  FormInterface
} from "serendip-business-model";
import { FormDateRangeInputComponent } from "./form-date-range-input/form-date-range-input.component";
import { FormFileInputComponent } from "./form-file-input/form-file-input.component";
import { formPartTemplates } from "src/app/schema/formPartTemplates";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.less"]
})
export class FormComponent implements OnInit {
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
    FormDateRangeInputComponent,
    FormFileInputComponent
  };

  constructor(
    public dataService: DataService,
    public httpClient: HttpClient,
    public ref: ChangeDetectorRef,
    private dashboardService: DashboardService,
    public idbService: IdbService
  ) {}

  @Output()
  DashboardCommand = new EventEmitter<{
    command: "open-tab";
    tab: DashboardTabInterface;
  }>();

  _ = _;

  @Input() saveButtonText = "ثبت";
  @Input() saveButtonIcon: string = "save-backup-1";

  @Input() title: string;
  @Input() minimal: boolean;

  @Input()
  model: any = false;

  @Input()
  formSchema: FormInterface;
  @Input()
  formsSchema: FormInterface[];

  @Input()
  entityName: string;
  @Input()
  entityModelName: string;
  @Input()
  entityLabel: string;
  @Input()
  entityIcon = "folder-archive-open";
  @Input()
  saveState: boolean;

  loading = false;

  @Input()
  defaultModel: any = {};
  @Input()
  private _mode: "form" | "triggers" = "form";
  public get mode(): "form" | "triggers" {
    return this._mode;
  }
  public set mode(value: "form" | "triggers") {
    if (this._mode !== value) {
      this.WidgetChange.emit({ inputs: { mode: value } });
    }

    this._mode = value;
  }

  @Input()
  documentId: string;

  @Input()
  formType: string;

  @Output()
  WidgetChange = new EventEmitter<DashboardWidgetInterface>();

  @Output()
  TabChange = new EventEmitter<DashboardTabInterface>();

  @Input()
  parts: FormPartInterface[];

  @Input()
  name: string;

  stateDb: Idb;
  async save() {
    if (!this.model._id) {
      const insertResult = await this.dataService.insert(
        this.entityName,
        this.model,
        this.entityName
      );
      this.WidgetChange.emit({
        inputs: {
          model: insertResult,
          documentId: insertResult._id
        }
      });
    } else {
      await this.dataService.update(
        this.entityName,
        this.model,
        this.entityName
      );
    }
  }

  async reset() {
    if (this.documentId) {
      this.model = await this.dataService.details(
        this.entityName,
        this.documentId,
        true
      );

      Object.keys(this.formSchema.defaultModel || {}).forEach(dKey => {
        console.log(dKey, typeof this.model[dKey]);
        if (
          typeof this.model[dKey] === "undefined" ||
          (this.model[dKey].length && this.model[dKey].length === 0)
        ) {
          this.model[dKey] = this.formSchema.defaultModel[dKey];
        }
      });
    } else {
      if (this.defaultModel && Object.keys(this.defaultModel).length > 0) {
        this.model = _.clone(this.defaultModel);
      } else {
        this.model = _.clone(this.formSchema.defaultModel);
      }
    }

    if (!this.model) {
      this.model = {};
    }

    this.WidgetChange.emit({ inputs: { model: this.model } });

    console.log("form model reset", this.model);
  }

  async detectChange() {
    this.ref.detectChanges();

    this.WidgetChange.emit({ inputs: { model: this.model } });
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  findFormInSchema(formName): FormInterface {
    return _.findWhere(this.formsSchema, { name: formName });
  }
  filterParts(parts: FormPartInterface[]) {
    if (!parts) {
      return [];
    }

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
  async ngOnInit() {
    this.loading = true;

    if (!this.formsSchema && !this.formSchema) {
      this.formsSchema = this.dashboardService.schema.forms;
    }

    if (!this.formSchema) {
      this.formSchema = _.findWhere(this.formsSchema, { name: this.name });
    }

    await this.reset();

    this.loading = false;
    this.ref.detectChanges();
  }

  getDynamicPart(componentName) {
    return this.DynamicParts[componentName];
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
      this.detectChange();
    };
  }
}
