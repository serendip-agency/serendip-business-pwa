import { DashboardService } from "./../dashboard.service";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "underscore";

import { PeopleTableComponent } from "../people/people-table/people-table.component";
import { PeopleSearchComponent } from "../people/people-search/people-search.component";
import { PeopleFormComponent } from "../people/people-form/people-form.component";
import { PeopleDeleteComponent } from "../people/people-delete/people-delete.component";
import { PeopleListComponent } from "../people/people-list/people-list.component";
import { CompanyDeleteComponent } from "../company/company-delete/company-delete.component";
import { CompanyListComponent } from "../company/company-list/company-list.component";
import { CompanyTableComponent } from "../company/company-table/company-table.component";
import { CompanyFormComponent } from "../company/company-form/company-form.component";
import { ComplaintDeleteComponent } from "../complaint/complaint-delete/complaint-delete.component";
import { ComplaintFormComponent } from "../complaint/complaint-form/complaint-form.component";
import { ComplaintTableComponent } from "../complaint/complaint-table/complaint-table.component";
import { ComplaintListComponent } from "../complaint/complaint-list/complaint-list.component";
import { ServiceDeleteComponent } from "../service/service-delete/service-delete.component";
import { ServiceTableComponent } from "../service/service-table/service-table.component";
import { ServiceListComponent } from "../service/service-list/service-list.component";
import { ServiceFormComponent } from "../service/service-form/service-form.component";
import { ProductDeleteComponent } from "../product/product-delete/product-delete.component";
import { ProductListComponent } from "../product/product-list/product-list.component";
import { ProductFormComponent } from "../product/product-form/product-form.component";
import { ProductTableComponent } from "../product/product-table/product-table.component";
import { CompanySearchComponent } from "../company/company-search/company-search.component";
import { ComplaintSearchComponent } from "../complaint/complaint-search/complaint-search.component";
import { ProductSearchComponent } from "../product/product-search/product-search.component";
import { InteractionFormComponent } from "../interaction/interaction-form/interaction-form.component";
import { InteractionTableComponent } from "../interaction/interaction-table/interaction-table.component";
import { InteractionListComponent } from "../interaction/interaction-list/interaction-list.component";
import { InteractionDeleteComponent } from "../interaction/interaction-delete/interaction-delete.component";
import { UserProfileComponent } from "../settings/user-profile/user-profile.component";

const dynamicComponents = {
  PeopleFormComponent,
  PeopleTableComponent,
  PeopleSearchComponent,
  PeopleDeleteComponent,
  PeopleListComponent,
  CompanyDeleteComponent,
  CompanyListComponent,
  CompanyTableComponent,
  CompanyFormComponent,
  ComplaintDeleteComponent,
  ComplaintFormComponent,
  ComplaintTableComponent,
  ComplaintListComponent,
  ServiceDeleteComponent,
  ServiceTableComponent,
  ServiceListComponent,
  ServiceFormComponent,
  ProductDeleteComponent,
  ProductListComponent,
  ProductFormComponent,
  ProductTableComponent,
  CompanySearchComponent,
  ComplaintSearchComponent,
  ProductSearchComponent,
  InteractionFormComponent,
  InteractionTableComponent,
  InteractionListComponent,
  InteractionDeleteComponent,
  UserProfileComponent
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  routerSubscription: Subscription;

  handleParams() {
    if (this.dashboardService.currentSection) {
      this.dashboardService.currentSection.tabs = _.map(
        this.dashboardService.currentSection.tabs,
        (tab: any) => {
          if (tab.deactivateOnRouteChange) {
            tab.title = null;
          }
          return tab;
        }
      );
    }

    const params = this.activatedRoute.snapshot.params;
    if (
      !this.dashboardService.currentSection ||
      (this.dashboardService.currentSection &&
        this.dashboardService.currentSection.name !== params.section)
    ) {
      this.dashboardService.currentSection = _.findWhere(
        this.dashboardService.schema,
        {
          name: params.section || "dashboard"
        }
      );
    }

    if (this.dashboardService.currentSection) {
      if (
        !this.dashboardService.currentTab ||
        (this.dashboardService.currentTab &&
          this.dashboardService.currentTab.name !== params.tab)
      ) {
        this.dashboardService.currentTab = _.findWhere(
          this.dashboardService.currentSection.tabs,
          {
            name: params.tab || "default"
          }
        );
      }
    }

    console.log("handleParams called.");
  }

  getComponent(componentName) {
    return dynamicComponents[componentName];
  }
  getWidgets() {
    if (
      this.dashboardService.currentSection &&
      this.dashboardService.currentTab
    ) {
      return this.dashboardService.currentTab.widgets;
    } else {
      return [];
    }
  }
  async ngOnInit() {

    await this.dashboardService.setDefaultSchema();

    this.handleParams();

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleParams();
      }
    });
  }
}
