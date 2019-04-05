import { Component, OnInit } from "@angular/core";
import * as sUtil from "serendip-utility";

@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.less"]
})
export class NoteComponent implements OnInit {
  constructor() {}

  public sUtil = sUtil;

  ngOnInit() {}
}
