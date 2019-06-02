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
  FormInterface,
  DashboardTabInterface
} from "serendip-business-model";
import { WsService } from "./ws.service";
import { EventEmitter } from "events";
import { ObService } from "./ob.service";
import swal from "sweetalert2";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  schema: {
    forms: FormInterface[];
    reports: ReportInterface[];
    dashboard: DashboardSectionInterface[];
  };

  syncVisible = false;

  currentSection: DashboardSectionInterface = { name: "", tabs: [] };

  get screen() {
    return window.innerWidth < 860 ? "mobile" : "desktop";
  }
  dashboardCommand = new EventEmitter();

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private obService: ObService,
    private router: Router
  ) {
    this.obService.listen("_dashboard").subscribe(msg => {
      setTimeout(() => {
        this.setDefaultSchema();
      }, 100);
    });

    this.obService.listen("_entity").subscribe(msg => {
      setTimeout(() => {
        this.setDefaultSchema();
      }, 100);
    });
  }
  logout() {
    swal({
      title: "خارج می‌شوید؟",
      text: "تمام اطلاعات ذخیره شده به صورت آفلاین، حذف خواهند شد.",
      type: "warning",
      showCancelButton: true,

      preConfirm: () => {
        return new Promise((resolve, reject) => {
          swal.showLoading();
          swal.getConfirmButton().innerText = "در حال خروج";

          this.authService.logout();
          this.router.navigate(["/auth"]);
          resolve();
        });
      }
    });
  }

  async setDefaultSchema() {
    this.schema = {
      forms: BusinessSchema.FormsSchema,
      dashboard: BusinessSchema.DashboardSchema,
      reports: BusinessSchema.ReportsSchema
    };

    this.schema.dashboard = ((await this.dataService.list(
      "_dashboard",
      0,
      0,
      true
    )) as any).concat(this.schema.dashboard);

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

    const entities = await this.dataService.list("_entity");

    this.schema.dashboard.push({
      name: "raw",
      icon: "copy",
      title: "گزارشات خام",
      tabs: entities.map(record => {
        const entityName = record.name;
        return {
          icon: "copy",
          active: true,
          title: "گزارش " + entityName,
          widgets: [
            {
              component: "ReportComponent",
              inputs: {
                entityName
              }
            }
          ]
        };
      })
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
