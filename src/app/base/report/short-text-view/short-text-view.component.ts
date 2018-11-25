import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-short-text-view",
  templateUrl: "./short-text-view.component.html",
  styleUrls: ["./short-text-view.component.less"]
})
export class ShortTextViewComponent implements OnInit {

  @Input() model: any;
  @Input() label: any;
  @Input() viewType: string;

  @Input() replace: { [key: string]: string } = {};
  constructor(private changeRef:ChangeDetectorRef) {}

  ngOnInit() {

  }
}
