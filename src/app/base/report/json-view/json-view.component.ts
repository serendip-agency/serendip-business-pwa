import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-json-view",
  templateUrl: "./json-view.component.html",
  styleUrls: ["./json-view.component.less"]
})
export class JsonViewComponent implements OnInit {
  @Input() model: any;
  @Input() label: any;
  @Input() viewType: string;

  @Input() replace: { [key: string]: string };
  constructor() {}

  typeOf(obj) {
    return typeof obj;
  }
  ngOnInit() {}
}
