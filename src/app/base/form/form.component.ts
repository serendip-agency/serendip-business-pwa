import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject
} from "@angular/core";
import {
  DashboardTabInterface,
  DashboardWidgetInterface,
  FormInterface,
  FormPartInterface,
  EntityModel
} from "serendip-business-model";
import { DashboardService } from "../../dashboard.service";
import * as _ from "underscore";

import { DataService } from "../../data.service";
import { Idb, IdbService } from "../../idb.service";
import { BusinessService } from "../../business.service";
import * as sUtil from "serendip-utility";
import { MAT_DIALOG_DATA } from "@angular/material";
@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.less"]
})
export class FormComponent implements OnInit {
  public get filesPath() {
    if (this.model && this.model._id) {
      return `businesses/${this.businessService.business._id}/${this.entityName}/${this.model._id}`;
    } else {
      return null;
    }
  }

  public sUtil = sUtil;
  constructor(
    public dashboardService: DashboardService,
    public dataService: DataService,
    public httpClient: HttpClient,
    public businessService: BusinessService,
    public ref: ChangeDetectorRef,
    public idbService: IdbService
  ) {
    this.ProxyWidgetChange.subscribe(item => {
      this.WidgetChange.emit({ inputs: { model: this.model } });
      console.warn("ProxyWidgetChange", item, this.model);
    });
  }

  @Output()
  DashboardCommand = new EventEmitter<{
    command: "open-tab";
    tab: DashboardTabInterface;
  }>();

  _ = _;

  public ProxyWidgetChange = new EventEmitter();
  @Input() saveButtonText = "ثبت";
  @Input() saveButtonIcon = "save-backup-1";

  @Input() title: string;
  @Input() minimal: boolean;

  @Input()
  private model: EntityModel = null;

  @Input()
  formSchema: FormInterface;
  @Input()
  formsSchema: FormInterface[];

  @Input() formId: string;

  @Input()
  entityName: string;

  @Input()
  entityIcon = "folder-archive-open";
  @Input()
  saveState: boolean;

  loading = false;

  @Input()
  defaultModel: any = {
    _entity: this.entityName
  };
  @Input()
  private _mode = "form";
  public get mode(): string {
    return this._mode;
  }
  public set mode(value) {
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

  stateDb: Idb<any>;

  wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  async save() {
    this.loading = true;
    let doc;

    if (!this.model._entity) {
      this.model._entity =
        this.entityName ||
        (this.formSchema ? this.formSchema.entityName : undefined);
    }

    if (!this.model._id) {
      doc = await this.dataService.insert(this.entityName, this.model);
    } else {
      doc = await this.dataService.update(this.entityName, this.model);
    }

    this.WidgetChange.emit({
      inputs: {
        model: doc,
        documentId: doc._id
      }
    });

    this.loading = false;
  }

  async init(reset?: boolean) {
    if (!this.formsSchema) {
      this.formsSchema = this.dashboardService.schema.forms;
    }

    if (this.name) {
      this.formSchema = _.findWhere(this.formsSchema, { name: this.name });
    }
    if (this.formId) {
      this.formSchema = (await this.dataService.details(
        "_form",
        this.formId
      )) as any;
    }

    if (!this.entityName) {
      if (this.formSchema && this.formSchema.entityName) {
        this.entityName = this.formSchema.entityName;
      }
    }

    if (this.documentId && (!this.model || reset)) {
      this.model = await this.dataService.details(
        this.entityName,
        this.documentId,
        false
      );
    }

    if (!this.model) {
      // Object.keys(this.formSchema.defaultModel || {}).forEach(dKey => {
      //   if (
      //     typeof this.model[dKey] === "undefined" ||
      //     (this.model[dKey].length && this.model[dKey].length === 0)
      //   ) {
      //     this.model[dKey] = this.formSchema.defaultModel[dKey];
      //   }
      // });

      // const tempMode = this.mode || "form";
      // this.mode = null;

      // setTimeout(() => {
      //   this.mode = tempMode;
      // }, 100);

      if (this.defaultModel && Object.keys(this.defaultModel).length > 0) {
        this.model = _.clone(this.defaultModel);
      } else {
        if (this.formSchema && this.formSchema.defaultModel) {
          this.model = _.clone(this.formSchema.defaultModel);
        } else {
          this.model = {};
        }
      }
    }
    if (!this.model) {
      this.model = {};
    }

    this.WidgetChange.emit({ inputs: { model: this.model } });
  }

  trackByFn(index: any, item: any) {
    return index;
  }
  jsonCodeChange(code) {
    try {
      this.model = JSON.parse(code);
    } catch (error) {}
    this.WidgetChange.emit({ inputs: { model: this.model } });
  }
  findFormInSchema(formName): FormInterface {
    return _.findWhere(this.formsSchema, { name: formName });
  }

  async ngOnInit() {
    console.log(this.name, this.formId);
    this.loading = true;

    await this.init();

    if (!this.formSchema || !this.formSchema.parts.length) {
      this.mode = "json";
    }

    this.loading = false;

    this.ref.detectChanges();
  }
}
