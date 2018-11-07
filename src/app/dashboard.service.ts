import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Injectable, ChangeDetectorRef } from "@angular/core";
import * as _ from "underscore";
import { DataService } from "./data.service";

import { BusinessService } from "./business.service";
import * as BusinessSchema from "./schema";
import {
  ReportInterface,
  DashboardSectionInterface,
  FormInterface
} from "./schema";
import { WsService } from "./ws.service";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  schema: {
    forms: FormInterface[];
    reports: ReportInterface[];
    dashboard: DashboardSectionInterface[];
  };

  currentSection: DashboardSectionInterface = null;
  screen: "desktop" | "mobile" = "desktop";

  constructor(
    private businessService: BusinessService,
    private httpClient: HttpClient,
    private dataService: DataService,
    private wsService: WsService
  ) {
    this.setScreen();
    window.onresize = () => {
      this.setScreen();
    };
  }

  setScreen() {
    this.screen = window.innerWidth < 860 ? "mobile" : "desktop";
  }

  async setDefaultSchema() {
    this.schema = {
      forms: BusinessSchema.FormsSchema,
      dashboard: BusinessSchema.DashboardSchema,
      reports: BusinessSchema.ReportsSchema
    };

    if (this.schema) return;

    if (!this.schema && localStorage.getItem("schema"))
      return (this.schema = JSON.parse(localStorage.getItem("schema")));

    this.schema = await this.dataService.request({
      path:
        "/api/schema?nocache=" +
        Math.random()
          .toString()
          .split(".")[1],
      method: "post",
      model: {
        _business: this.businessService.getActiveBusinessId()
      }
    });

    console.log(this.schema);

    // localStorage.setItem(
    //   "schema",
    //   JSON.stringify(model)
    // );
    // location.reload();
  }
  getActiveTabs() {
    if (!this.currentSection) {
      return [];
    }

    return _.filter(this.currentSection.tabs, (item: any) => {
      return item.title;
    });
  }
}
