import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-form-html-input",
  templateUrl: "./form-html-input.component.html",
  styleUrls: ["./form-html-input.component.less"]
})
export class FormHtmlInputComponent implements OnInit {
  @Input() model;
  @Input() tab = 'editor'
  @Input() label;
  @Output() modelChange = new EventEmitter<any>();

  ngOnInit() { }
}
