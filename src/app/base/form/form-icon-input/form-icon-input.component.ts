import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import Icons from "./form-icon-input.data";

@Component({
  selector: "app-form-icon-input",
  templateUrl: "./form-icon-input.component.html",
  styleUrls: ["./form-icon-input.component.less"]
})
export class FormIconInputComponent implements OnInit {
  icons = Icons;

  browse = false;
  model: string;
  @Output() modelChange = new EventEmitter<string>();

  label: string;

  constructor() {}

  ngOnInit() {}
}
