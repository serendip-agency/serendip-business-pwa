import { DashboardService } from "./../dashboard.service";
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, NavigationCancel } from "@angular/router";
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
import { CrmService } from "../crm.service";
import { GmapsService } from "../gmaps.service";

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
  styleUrls: ["./dashboard.component.less"]
})
export class DashboardComponent implements OnInit, OnDestroy {

  explorerVisible: boolean = false;
  explorerAnimDone: boolean = true;

  gridLayout = {
    containers: []
  };

  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public crmService: CrmService,
  ) {

  }



  routerSubscription: Subscription;
  search: { text: String, mode: string } = { text: '', mode: 'contacts' };

  startActive: Boolean = false;

  clickOnStartWrapper(event: MouseEvent) {
    if ((event.target as HTMLElement).getAttribute('id') === 'start')
      this.startActive = false;
  }

  getExplorerTabs(tabs: any) {

    return _.filter(tabs, (tab: any) => {
      return tab.title != null && tab.name != "default";
    });

  }

  explorerAnimTimeout = null;
  explorerMouseIn() {

    this.explorerVisible = true;
    this.explorerAnimDone = false;

    clearTimeout(this.explorerAnimTimeout);

    this.explorerAnimTimeout = setTimeout(() => {
      this.explorerAnimDone = true;
    }, 500);

  }


  explorerMouseOut() {

    this.explorerVisible = false;
    this.explorerAnimDone = false;

    clearTimeout(this.explorerAnimTimeout);

    this.explorerAnimTimeout = setTimeout(() => {
      this.explorerAnimDone = true;
    }, 500);

  }



  getExplorerSections(sections: any) {

    return _.filter(sections, (sec: any) => {
      return sec.name != "dashboard";
    });


  }

  handleParams() {

    const params = this.activatedRoute.snapshot.params;

    if (!this.dashboardService.currentSection || (this.dashboardService.currentSection && this.dashboardService.currentSection.name !== params.section))
      this.dashboardService.currentSection = _.findWhere(this.dashboardService.schema, { name: params.section });


    if (this.dashboardService.currentSection) {
      this.gridLayout.containers.push({ tabs: _.clone(this.dashboardService.currentSection.tabs) });

      this.gridLayout.containers[0].tabs[0].active = true;
    }


    console.log("handleParams called.");

  }

  addContainer() {

    if (this.dashboardService.currentSection) {
      this.gridLayout.containers.push({ tabs: JSON.parse(JSON.stringify(this.dashboardService.currentSection.tabs)) });
      this.gridLayout.containers[1].tabs[0].active = true;
    }


  }

  setTabActive(tab, container) {

    _.forEach(container.tabs, (t: any) => {
      if (t.name != tab.name)
        t.active = false;
    });

    tab.active = true;

  }

  getComponent(componentName) {
    return dynamicComponents[componentName];
  }

  getTabWidgets(tab) {

    if (tab.widgets)
      return tab.widgets
    else
      return [];

  }
  ngOnDestroy(): void {


    if (this.routerSubscription)
      this.routerSubscription.unsubscribe();

  }
  async ngOnInit() {


    await this.dashboardService.setDefaultSchema();

    this.handleParams();

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleParams();
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.startActive = false;
      }

    });
  }
}
