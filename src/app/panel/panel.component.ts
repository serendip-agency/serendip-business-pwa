import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DashboardTabInterface, EntityModel } from "serendip-business-model";
import * as _ from "underscore";

import { WsService } from "../ws.service";
import { DashboardService } from "./../dashboard.service";
import { ObService } from "../ob.service";
import { DataService } from "../data.service";
import { BusinessService } from "../business.service";
import { ComponentRepositoryService } from "../component-repository.service";
import { GridComponent } from "../base/grid/grid.component";
import { AuthService } from "../auth.service";
import { NotificationService } from "../notification.service";
import * as moment from "moment";
@Component({
  selector: "app-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.less"]
})
export class PanelComponent implements OnInit {
  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private wsService: WsService,
    public obService: ObService,
    public dataService: DataService,
    public router: Router,
    public authService: AuthService,
    public notificationService: NotificationService,

    public businessService: BusinessService,
    public componentRepositoryService: ComponentRepositoryService,

    public dialog: MatDialog
  ) {
    this.dashboardService.dashboardCommand.on("command", input => {
      this.dashboardCommand()(input);
    });
  }

  moment = moment;

  get dynamicComponents() {
    return {
      ...this.componentRepositoryService.dynamicComponents,
      ...{
        GridComponent
      }
    };
  }
  dialogRef: any;
  entitySocket: WebSocket;

  mobileNavVisible = false;

  _ = _;
  stringToSlug(input: string = "") {
    return input
      .toLowerCase()
      .trim()
      .replace(/ /g, "-");
  }

  log(input) {
    console.log(input);
  }
  async handleParams(params) {
    this.dashboardService.currentSection = _.findWhere(
      this.dashboardService.schema.dashboard,
      {
        name: params.section || "analytics"
      }
    );

    this.dashboardService.currentTab =
      this.dashboardService.currentSection.tabs.find(
        p => this.stringToSlug(p.title) === this.stringToSlug(params.tab)
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
          this.componentRepositoryService.dynamicComponents[widget.component],
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

      console.log("entitySocket", data);

      this.obService.publish(data.model._entity, data.event, data.model);
    };
  }
  async ngOnInit() {
    if (!this.businessService.getActiveBusinessId()) {
      this.router.navigate(["/business"]);
      return;
    }

    await this.dataService.loadBusiness();

    await this.dashboardService.setDefaultSchema();

    await this.handleParams(this.activatedRoute.snapshot.params);

    this.initEntitySocket()
      .then()
      .catch(console.warn);

    this.notificationService
      .init()
      .then(() => {})
      .catch(console.warn);

    this.router.events.subscribe(async (event: any) => {
      if (event instanceof NavigationEnd) {
        await this.handleParams(this.activatedRoute.snapshot.params);
      }
    });
  }
}
