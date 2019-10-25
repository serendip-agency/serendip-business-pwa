import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  Router
} from "@angular/router";
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import * as moment from "moment-jalaali";
import { DndDropEvent } from "ngx-drag-drop";
import { Subscription } from "rxjs";
import * as _ from "underscore";

import { FormComponent } from "../base/form/form.component";
import { ReportComponent } from "../base/report/report.component";
import { TriggersComponent } from "../base/triggers/triggers.component";
import { BusinessService } from "../business.service";
import { IdbService, IdbDeleteAllDatabases } from "../idb.service";
import * as lunr from "lunr";
import {
  DashboardContainerInterface,
  DashboardGridInterface,
  DashboardSectionInterface,
  DashboardTabInterface,
  DashboardWidgetInterface,
  EntityModel
} from "serendip-business-model";
import { WidgetService } from "../widget.service";
import { WsService } from "../ws.service";
import { DashboardService } from "./../dashboard.service";
import { CalendarService } from "../calendar.service";
import { WeatherService } from "../weather.service";
import { GmapsService } from "../gmaps.service";
import { DataService } from "../data.service";
import { AuthService } from "../auth.service";
import { MatSnackBar } from "@angular/material";
import { text, validate } from "serendip-utility";
import { BusinessComponent } from "../business/business.component";
import { AccountProfileComponent } from "../account/account-profile/account-profile.component";
import { AccountPasswordComponent } from "../account/account-password/account-password.component";
import { AccountSessionsComponent } from "../account/account-sessions/account-sessions.component";
import { ObService } from "../ob.service";
import { StorageService } from "../storage.service";
import { ReportService } from "../report.service";
import { AggregationComponent } from "../base/aggregation/aggregation.component";

@Component({
  selector: "app-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.less"]
})
export class PanelComponent implements OnInit {
  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    public storageService: StorageService,
    private router: Router,
    public businessService: BusinessService,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef,
    private reportService: ReportService,
    private widgetService: WidgetService,
    private wsService: WsService,
    public obService: ObService,
    public calendarService: CalendarService,
    public weatherService: WeatherService,
    public authService: AuthService,
    public gmapsService: GmapsService,
    public dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  dynamicComponents = {
    FormComponent,
    ReportComponent,
    BusinessComponent,
    TriggersComponent,
    AccountProfileComponent,
    AccountPasswordComponent,
    AccountSessionsComponent,
    AggregationComponent
  };

  async handleParams(params) {
    this.dashboardService.currentSection = _.findWhere(
      this.dashboardService.schema.dashboard,
      {
        name: params.section || "raw"
      }
    );

    this.dashboardService.currentTab =
      this.dashboardService.currentSection.tabs.find(
        p => p.title === params.tab
      ) || this.dashboardService.currentSection.tabs[0];

  }

  dashboardCommand() {
    return (options: { command: "open-tab"; tab: DashboardTabInterface }) => {
      this.dashboardService.currentSection.tabs.push(options.tab);
      this.dashboardService.currentTab = options.tab;
    };
  }

  async ngOnInit() {
    await this.dashboardService.setDefaultSchema();


    if (!this.businessService.getActiveBusinessId()) {
      this.router.navigate(["/business"]);
      return;
    }


    await this.handleParams(this.activatedRoute.snapshot.params);

    this.router.events.subscribe(async (event: any) => {
      if (event instanceof NavigationEnd) {
        await this.handleParams(this.activatedRoute.snapshot.params);
      }
    });

    if (!this.businessService.getActiveBusinessId()) {
      this.router.navigate(["/business"]);
      return;
    }
  }
}
