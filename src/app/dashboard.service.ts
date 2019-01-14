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
import { ObService } from "./ob.service";

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

  constructor(private dataService: DataService, private obService: ObService) {
    this.setScreen();
    window.onresize = () => {
      this.setScreen();
    };

    this.obService.listen("dashboard").subscribe(() => {
      this.setDefaultSchema();
    });
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
    const primaryFields = _.findWhere(this.schema.reports, {
      name: "primary"
    }).fields;

    this.schema.reports = this.schema.reports.map(report => {
      if (report.name !== "primary") {
        primaryFields.forEach(pf => {
          if (report.fields.filter(f => f.name == pf.name).length == 0) {
            report.fields.push(pf);
          }
        });
      }
      return report;
    });

    this.schema.dashboard = (await this.dataService.list(
      "dashboard",
      0,
      0
    )).concat(this.schema.dashboard);

    this.schema.dashboard = this.schema.dashboard.map(dashboard => {
      dashboard.tabs = dashboard.tabs.map(tab => {
        if (tab.widget) {
          tab.widgets = [tab.widget];
          delete tab.widget;
        }
        return tab;
      });
      return dashboard;
    });
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
