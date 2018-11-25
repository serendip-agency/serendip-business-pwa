import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-objectid-view',
  templateUrl: './objectid-view.component.html',
  styleUrls: ['./objectid-view.component.less']
})
export class ObjectidViewComponent implements OnInit {

  @Input() model: any;
  @Input() viewType: string;
  @Input() label: any;

  constructor() { }

  ngOnInit() {
  }

}
