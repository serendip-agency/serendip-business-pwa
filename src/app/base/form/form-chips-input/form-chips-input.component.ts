import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { DataService } from "src/app/data.service";
import { MatSnackBar, MatAutocompleteSelectedEvent } from "@angular/material";
import { IdbService } from "src/app/idb.service";
import * as _ from "underscore";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DashboardService } from "src/app/dashboard.service";
import { ObService } from "src/app/ob.service";
import * as sUtil from "serendip-utility";
import { Subscription } from "rxjs";
@Component({
  selector: "app-form-chips-input",
  templateUrl: "./form-chips-input.component.html",
  styleUrls: ["./form-chips-input.component.less"]
})
export class FormChipsInputComponent implements OnInit, OnDestroy {
  creatingEntity: boolean;
  loading = false;
  obServiceSubscription: Subscription;
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

  @Input() selectType: "single" | "multiple";

  @Input() labelField;
  @Input() valueField;
  @Input() formName;
  @Input() entityName: string;
  @Input() label: string;

  @Input() propertiesToSearch: string[] = [];

  @Input() propertiesSearchMode;
  public _model: any;

  @Input()
  set model(value: any) {
    //

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
        "Want to edit " +
          (model
            ? this.propertiesToSearch
                .map(key => {
                  return model[key] || "";
                })
                .join(" ")
            : _id) +
          " ?",
        "Yes",
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
                component: "FormDialogComponent",
                inputs: {
                  name: this.formName,
                  documentId: _id,
                  entityName: this.entityName,
                  entityLabel: this.label,
                  closeOnSave: true
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

  async selectEntity(event: MatAutocompleteSelectedEvent) {
    if (event.option.value === "new") {
      this.creatingEntity = true;
      this.dashboardService.dashboardCommand.emit("command", {
        command: "open-tab",
        tab: {
          title: "ثبت " + this.label + " جدید",
          active: true,
          icon: "office-paper-work-pen",
          widgets: [
            {
              component: "FormDialogComponent",
              inputs: {
                name: this.formName,
                entityName: this.entityName,
                entityLabel: this.label,
                closeOnSave: true
              }
            }
          ]
        }
      });

      return;
    }

    this.cachedEntities[event.option.value] = await this.dataService.details(
      this.entityName,
      event.option.value
    );

    if (this.selectType === "multiple") {
      if (!this.model) {
        this.model = [];
      }
      this.model.push(event.option.value);
    } else {
      this.model = event.option.value;
    }

    this.modelChange.emit(this.model);
  }

  // validateEntities(contact) {
  //   contact.get('companys').value = _.filter(contact.get('companys').value, (item: string) => {
  //     return item.length == 24
  //   })
  // }

  async filterEntities(input, currentValues) {
    if (input) {
      this.loading = true;
      this.filteredEntities = _.filter(
        await this.dataService.search(
          this.entityName,
          sUtil.text.replacePersianDigitsWithEnglish(input),
          10,
          this.propertiesToSearch,
          this.propertiesSearchMode,
          false
        ),
        (item: any) => {
          if (!currentValues) {
            return true;
          }
          return currentValues.indexOf(item._id) === -1;
        }
      );

      this.loading = false;
    }
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
    if (!this.model) {
      if (this.selectType === "multiple") {
        this.model = [];
      }
    }

    this.filterEntities(" ", []);

    if (this.model) {
      if (this.selectType === "single") {
        this.cachedEntities[this.model] = await this.dataService.details(
          this.entityName,
          this.model,
          true
        );
      }
    }

    this.obServiceSubscription = this.obService
      .listen(this.entityName)
      .subscribe(async (msg: { eventType: any; model: any }) => {
        const model = msg.model;

        this.cachedEntities[model._id] = model;
        this.changeRef.detectChanges();
        if (this.creatingEntity) {
          this.selectEntity({ option: { value: model._id } } as any);

          this.creatingEntity = false;
        }
      });
  }

  ngOnDestroy() {
    this.obServiceSubscription.unsubscribe();
  }
}
