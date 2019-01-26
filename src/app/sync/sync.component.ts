import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { DashboardService } from "../dashboard.service";

@Component({
  selector: "app-sync",
  templateUrl: "./sync.component.html",
  styleUrls: ["./sync.component.css"]
})
export class SyncComponent implements OnInit {
  constructor(
  public dataService: DataService,
  public dashboardService: DashboardService
  ) {


  }

  ngOnInit() {}
}
