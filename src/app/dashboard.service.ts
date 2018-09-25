import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Injectable, ChangeDetectorRef } from "@angular/core";
import * as _ from "underscore";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  schema: any;
  currentSection: any = null;
  currentTab: any = null;
  screen: string = "desktop";

  constructor(private httpClient: HttpClient) {

    // this.setScreen();
    //  window.onresize = () => { this.setScreen() };

    // if (localStorage.getItem("schema")) {
    //   this.schema = JSON.parse(localStorage.getItem("schema"));
    // } else {
    //   this.setDefaultSchema();
    // }
  }

  setScreen() {
    this.screen = window.innerWidth < 900 ? "mobile" : "desktop";

  }

  async setDefaultSchema() {
    var model = await this.httpClient.get("schema/default.json").toPromise();
    this.schema = model;
    localStorage.setItem(
      "schema",
      JSON.stringify(model)
    );
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

  setCurrentTab(tab) {
    setTimeout(() => {
      this.currentTab = _.extend(this.currentTab, tab);
    }, 10);
  }
}