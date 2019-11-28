import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { ComponentRepositoryService } from "../../component-repository.service";
import { DashboardTabInterface } from "serendip-business-model";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.less"]
})
export class GridComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public componentRepositoryService: ComponentRepositoryService
  ) {}

  @Output()
  DashboardCommand = new EventEmitter<{
    command: "open-tab";
    tab: DashboardTabInterface;
  }>();
  options: GridsterConfig = {
    gridType: "verticalFixed",
    displayGrid: "always",
    minCols: 15,
    minRows: 15,
    margin: 0,
    fixedRowHeight: 50,
    draggable: {
      enabled: true
    },
    resizable: {
      enabled: true
    }
  };
  dashboard: any[];

  dashboardCommand() {
    return (options: { command: "open-tab"; tab: DashboardTabInterface }) => {
      // this.dashboardService.currentSection.tabs.push(options.tab);
      // this.dashboardService.currentTab = options.tab;
      this.DashboardCommand.emit(options);
    };
  }

  static itemChange(item, itemComponent) {
    console.info("itemChanged", item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    console.info("itemResized", item, itemComponent);
  }

  ngOnInit() {

    this.dashboard = [{
      cols: 15,
      rows: 15,
      y: 0,
      x: 0,
      component: "ReportComponent",
      inputs: {
        entityName: "Tokens"
      }
    }];

  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    // this.dialog.open(
    //   this.componentRepositoryService.dynamicComponents["FormDialogComponent"],
    //   {
    //     width: window.innerWidth > 1024 ? "720px" : "420px",
    //     data: {
    //       name: "add-widadd-widget-to-grid-form"
    //     }
    //   }
    // );

    this.dashboard.push({
      cols: 15,
      rows: 15,
      y: 0,
      x: 0,
      component: "ReportComponent",
      inputs: {
        entityName: "Tokens"
      }
    });
  }
}
