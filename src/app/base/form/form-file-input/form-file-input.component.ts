import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-form-file-input",
  templateUrl: "./form-file-input.component.html",
  styleUrls: ["./form-file-input.component.less"]
})
export class FormFileInputComponent implements OnInit {
  constructor() {}

  @Input() label: string;

  ngOnInit() {}
}
