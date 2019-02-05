import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-icon-view",
  templateUrl: "./icon-view.component.html",
  styleUrls: ["./icon-view.component.less"]
})
export class IconViewComponent implements OnInit {
  @Input() viewType;
  @Input() label;
  @Input() model;
  constructor() {}

  ngOnInit() {}
}
