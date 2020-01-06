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
import { environment } from 'src/environments/environment';

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

  currentSection: DashboardSectionInterface = {
    product: "base",
    name: "",
    tabs: []
  };
  currentTab: DashboardTabInterface;

  get screen() {
    return window.innerWidth < 860 ? "mobile" : "desktop";
  }
  dashboardCommand = new EventEmitter();
  setSchemaTimeout;
  constructor(
    private dataService: DataService,
    private businessService: BusinessService,
    private authService: AuthService,
    private obService: ObService,
    private router: Router
  ) {

    this.obService.listen("_dashboard").subscribe(msg => {

      if (this.setSchemaTimeout) {
        clearTimeout(this.setSchemaTimeout);
      }

      this.setSchemaTimeout = setTimeout(() => {
        this.setDefaultSchema();
      }, 1000);
    });

    this.obService.listen("_entity").subscribe(msg => {
      setTimeout(() => {
        this.setDefaultSchema();
      }, 100);
    });
  }
  logout() {
    swal({
      title: "Want to logout ?",
      text: "All offline saved reports and data will be cleared",
      type: "warning",
      showCancelButton: true,

      preConfirm: () => {
        return new Promise((resolve, reject) => {
          swal.showLoading();
          swal.getConfirmButton().innerText = "...";

          this.authService.logout();
          this.router.navigate(["/auth"]);
          resolve();
        });
      }
    });
  }

  async setDefaultSchema() {
    this.schema = {
      reports: _.clone(BusinessSchema.ReportsSchema),
      forms: _.clone(BusinessSchema.FormsSchema),
      dashboard: _.clone(BusinessSchema.DashboardSchema).filter(
        (p: any) => ["base"].indexOf(p.product) !== -1
      )
    };

    this.schema.dashboard = this.schema.dashboard.concat(
      (await this.dataService.list("_dashboard", 0, 0, true)) as any
    );

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

    const entityTypes = await this.dataService.request({
      method: "get",
      path: "/api/entity/types",
      retry: false
    });

    console.log("entityTypes", entityTypes);
    const entitiesInDb = await this.dataService.list("_entity");

    if (this.schema.dashboard.find(p => p.name === 'raw')) {
      this.schema.dashboard.shift();
    }

    this.schema.dashboard.unshift({
      name: "raw",
      product: "base",
      icon: "copy",
      title: "Collections",
      tabs: _.uniq(entityTypes.concat(entitiesInDb.map(p => p.name).filter((p: string) => !p.startsWith('_')))).map(
        (name: any) => {
          return {
            icon: "copy",
            active: true,
            title: name.replace(/_/g, " ").trim(),
            widgets: [
              {
                component: "ReportComponent",
                inputs: {
                  entityName: name
                }
              }
            ]
          };
        }
      ) as any
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
