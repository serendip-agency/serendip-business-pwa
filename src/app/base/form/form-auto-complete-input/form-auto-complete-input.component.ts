import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { DataService } from "src/app/data.service";
import {
  MatSnackBar,
  MatAutocompleteSelectedEvent,
  MatInput
} from "@angular/material";
import { IdbService } from "src/app/idb.service";
import * as _ from "underscore";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DashboardService } from "src/app/dashboard.service";
import { ObService } from "src/app/ob.service";

@Component({
  selector: "app-form-auto-complete-input",
  templateUrl: "./form-auto-complete-input.component.html",
  styleUrls: ["./form-auto-complete-input.component.less"]
})
export class FormAutoCompleteInputComponent implements OnInit {
  @ViewChild("entitySingleAutoInput") inputTextBox: ElementRef;
  creatingEntity: boolean;
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private idbService: IdbService,
    private obService: ObService,
    private dashboardService: DashboardService,
    private changeRef: ChangeDetectorRef
  ) {}

  newEntityId = Math.random()
    .toString()
    .split(".")[1];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() modelChange = new EventEmitter<any>();

  filteredEntities = [];

  cachedEntities = {};

  @Input() propertiesSearchMode;
  @Input() strict: boolean;
  @Input() entityName: string;
  @Input() data: any[];
  @Input() label: string;

  @Input() propertiesToSearch: string[] = [];
  public _model: any;

  @Input()
  set model(value: any) {
    // console.log('set model chips',value);

    // if (!value) {
    //   if (this.selectType == "multiple") {
    //     this._model = [];
    //   } else {
    //     this._model = null;
    //   }

    //   return;
    // }

    // if (this.selectType == "multiple") {
    //   value = _.filter(value, item => {
    //     return item !== undefined;
    //   });
    // }
    if (this._model !== value) {
      this._model = value;
      this.changeRef.detectChanges();
    }
  }

  get model(): any {
    return this._model;
  }

  getEntity(_id) {
    if (this.cachedEntities[_id]) {
      return this.cachedEntities[_id];
    } else {
      return null;
    }
  }

  goEntity(_id) {
    const model = this.getEntity(_id);
    this.snackBar
      .open(
        "اطلاعات موجود از " +
          this.rpd(
            this.propertiesToSearch
              .map(key => {
                return model[key] || "";
              })
              .join(" ")
          ) +
          " را میخواهید؟",
        "بله",
        {
          duration: 3000
        }
      )
      .onAction()
      .subscribe(() => {
        this.dashboardService.dashboardCommand.emit("command", {
          command: "open-tab",
          tab: {
            title: "ویرایش " + this.label,
            active: true,
            icon: "office-paper-work-pen",
            widgets: [
              {
                component: "FormComponent",
                inputs: {
                  name: "crm-" + this.entityName + "-form",
                  documentId: _id,
                  entityName: this.entityName,
                  entityLabel: this.label
                }
              }
            ]
          }
        });
      });
  }

  removeEntity(contact, item) {
    this.model.splice(this.model.indexOf(item), 1);
    //  this.modelChange.emit(this.model);
  }

  async selectEntity(event: any) {

    let newValue = "";

    if (event.option && event.option.value) {
      newValue = event.option.value;
    }

    if (event.target && event.target.value) {
      newValue = event.target.value;
    }

    if (this.entityName) {
      if (newValue === "new") {
        this.creatingEntity = true;
        this.dashboardService.dashboardCommand.emit("command", {
          command: "open-tab",
          tab: {
            title: "ثبت " + this.label + " جدید",
            active: true,
            icon: "office-paper-work-pen",
            widgets: [
              {
                component: "FormComponent",
                inputs: {
                  name: "crm-" + this.entityName + "-form",
                  entityName: this.entityName,
                  entityLabel: this.label
                }
              }
            ]
          }
        });

        return;
      }

      this.cachedEntities[newValue] = await this.dataService.details(
        this.entityName,
        newValue
      );
    }

    if (this.strict) {
      if (!this.entityName) {
        if (this.filteredEntities.indexOf(newValue) !== -1) {
          this.model = newValue;
        } else {
          this.inputTextBox.nativeElement.value = "";
        }
      } else {
        if (_.where(this.filteredEntities, { _id: newValue }).length > 0) {
          this.model = newValue;
        } else {
          this.inputTextBox.nativeElement.value = "";
        }
      }
    } else {
      this.model = newValue;
    }

    this.modelChange.emit(this.model);
  }

  // validateEntities(contact) {
  //   contact.get('companys').value = _.filter(contact.get('companys').value, (item: string) => {
  //     return item.length == 24
  //   })
  // }

  async filterEntities(input, currentValues) {
    this.filteredEntities = _.filter(
      this.entityName
        ? await this.dataService.search(
            this.entityName,
            input || "",
            10,
            this.propertiesToSearch,
            this.propertiesSearchMode
          )
        : _.filter(this.data, (item: any) => {
            if (!input) return true;
            else return JSON.stringify(item).indexOf(input) !== -1;
          }),
      (item: any) => {
        return currentValues.indexOf(item._id) === -1;
      }
    );
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

  async ngOnInit() {
    this.filterEntities("", []);

    this.obService.listen(this.entityName).subscribe(async (model: any) => {
      this.cachedEntities[model._id] = model;
      this.changeRef.detectChanges();

      console.log(this.cachedEntities, model);
      if (this.creatingEntity) {
        this.selectEntity({ option: { value: model._id } } as any);

        this.creatingEntity = false;
      }
    });
  }
}
