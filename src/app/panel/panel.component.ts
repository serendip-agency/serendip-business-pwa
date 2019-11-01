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
import { MatSnackBar, MatDialog } from "@angular/material";
import { text, validate } from "serendip-utility";
import { BusinessComponent } from "../business/business.component";
import { AccountProfileComponent } from "../account/account-profile/account-profile.component";
import { AccountPasswordComponent } from "../account/account-password/account-password.component";
import { AccountSessionsComponent } from "../account/account-sessions/account-sessions.component";
import { ObService } from "../ob.service";
import { StorageService } from "../storage.service";
import { ReportService } from "../report.service";
import { DynamicComponent } from "ng-dynamic-component";
import { ImportComponent } from "../import/import.component";
import { FormDialogComponent } from "../base/form/form-dialog/form-dialog.component";
@Component({
  selector: "app-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.less"]
})
export class PanelComponent implements OnInit {
  dialogRef: any;
  entitySocket: WebSocket;

  mobileNavVisible = false;
  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private wsService: WsService,
    public obService: ObService,
    public dataService: DataService,
    private router: Router,
    public businessService: BusinessService,

    public dialog: MatDialog
  ) {}

  dynamicComponents = {
    FormComponent,
    ReportComponent,
    BusinessComponent,
    TriggersComponent,
    AccountProfileComponent,
    AccountPasswordComponent,
    AccountSessionsComponent,
    ImportComponent,
    FormDialogComponent
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
      // this.dashboardService.currentSection.tabs.push(options.tab);
      // this.dashboardService.currentTab = options.tab;
      const widget =
        options.tab.widgets && options.tab.widgets[0]
          ? options.tab.widgets[0]
          : options.tab.widget;

      if (widget) {
        this.dialogRef = this.dialog.open(
          this.dynamicComponents[widget.component],
          {
            width: window.innerWidth > 1024 ? "720px" : "420px",
            data: widget.inputs || {}
          }
        );
      }
    };
  }
  async initEntitySocket() {
    this.entitySocket = await this.wsService.newSocket("/entity", true);
    this.entitySocket.onclose = () => this.initEntitySocket();
    this.entitySocket.onmessage = msg => {
      const data: {
        event: "update" | "delete" | "insert";
        model: EntityModel;
      } = JSON.parse(msg.data);

      if (data.model) {
        data.model = this.dataService.decrypt(data.model);
      }

      this.obService.publish(data.model._entity, data.event, data.model);
    };
  }
  async ngOnInit() {
    this.initEntitySocket()
      .then()
      .catch();

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
