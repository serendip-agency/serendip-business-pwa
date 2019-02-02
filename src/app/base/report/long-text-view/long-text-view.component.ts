import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-long-text-view",
  templateUrl: "./long-text-view.component.html",
  styleUrls: ["./long-text-view.component.less"]
})
export class LongTextViewComponent implements OnInit {
  @Input() model: any;
  @Input() label: any;
  @Input() viewType: string;

  @Input() replace: { [key: string]: string } = {};
  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit() {}
}
