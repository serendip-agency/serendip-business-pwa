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
} from "serendip-business-model";
import { WsService } from "./ws.service";
import { EventEmitter } from "events";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  schema: {
    forms: FormInterface[];
    reports: ReportInterface[];
    dashboard: DashboardSectionInterface[];
  };

  currentSection: DashboardSectionInterface = { name: "", tabs: [] };
  screen: "desktop" | "mobile" = "desktop";

  dashboardCommand = new EventEmitter();

  constructor() {
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
