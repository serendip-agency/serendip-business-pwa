import { Component, OnInit, Input } from "@angular/core";
import * as sUtil from "serendip-utility";
import { DataService } from "../data.service";
import { CalendarService } from "../calendar.service";

@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.less"]
})
export class NoteComponent implements OnInit {
  notes: any;
  constructor(
    private dataService: DataService,
    private calendarService: CalendarService
  ) {}

  @Input() relatedEntityId;

  public sUtil = sUtil;

  async ngOnInit() {
    this.notes = await this.dataService.list("_note", 0, 0);
  }
}
