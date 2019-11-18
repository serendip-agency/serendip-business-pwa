import { Component, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { ComponentRepositoryService } from "../../component-repository.service";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.less"]
})
export class GridComponent implements OnInit {
  constructor(public componentRepositoryService: ComponentRepositoryService) {}

  options: GridsterConfig = {
    gridType: "verticalFixed",
    displayGrid: "always",
    minCols: 20,
    minRows: 4,
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

  static itemChange(item, itemComponent) {
    console.info("itemChanged", item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    console.info("itemResized", item, itemComponent);
  }

  ngOnInit() {
    this.dashboard = [
      {
        cols: 15,
        rows: 15,
        y: 0,
        x: 0,
        component: "ReportComponent",
        inputs: {
          entityName: "Tokens"
        }
      }
    ];
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({
      cols: 4,
      rows: 3,
      y: 0,
      x: 0,
      component: "ReportComponent",
      inputs: {
        entityName: "Tokens"
      }
    });
  }
}
