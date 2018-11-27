import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-form-price-input",
  templateUrl: "./form-price-input.component.html",
  styleUrls: ["./form-price-input.component.css"]
})
export class FormPriceInputComponent implements OnInit {
  constructor() {}

  @Output() modelChange = new EventEmitter();
  @Input() label: string;
  @Input() model: any = {};
  ngOnInit() {
    if (!this.model) this.model = { type: "", value: "" };
  }
}
