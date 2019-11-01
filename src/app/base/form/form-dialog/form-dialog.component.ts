import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { FormComponent } from "../form.component";
import { DataService } from "../../../data.service";
import { HttpClient } from "@angular/common/http";
import { BusinessService } from "../../../business.service";
import { DashboardService } from "../../../dashboard.service";
import { IdbService } from "../../../idb.service";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-form-dialog",
  templateUrl: "../form.component.html",
  styleUrls: ["../form.component.less"]
})
export class FormDialogComponent extends FormComponent {
  constructor(
    public dataService: DataService,
    public httpClient: HttpClient,
    public businessService: BusinessService,
    public ref: ChangeDetectorRef,
    public dashboardService: DashboardService,
    public idbService: IdbService,
    @Inject(MAT_DIALOG_DATA) matDialogData: any = {}
  ) {
    super(
      dashboardService,
      dataService,
      httpClient,
      businessService,
      ref,
      idbService
    );

    Object.keys(matDialogData).forEach(key => {
      this[key] = matDialogData[key];
    });
  }
}
