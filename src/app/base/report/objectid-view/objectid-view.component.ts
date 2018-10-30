import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { widgetCommandInterface } from 'src/app/models';

@Component({
  selector: 'app-objectid-view',
  templateUrl: './objectid-view.component.html',
  styleUrls: ['./objectid-view.component.less']
})
export class ObjectidViewComponent implements OnInit {

  @Output() widgetCommand: EventEmitter<widgetCommandInterface> = new EventEmitter<widgetCommandInterface>();
  @Input() model: any;
  
  constructor() { }

  ngOnInit() {
  }

}
