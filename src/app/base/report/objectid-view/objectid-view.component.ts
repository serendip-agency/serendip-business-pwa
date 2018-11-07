import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WidgetCommandInterface } from 'src/app/models';

@Component({
  selector: 'app-objectid-view',
  templateUrl: './objectid-view.component.html',
  styleUrls: ['./objectid-view.component.less']
})
export class ObjectidViewComponent implements OnInit {

  @Output() widgetCommand: EventEmitter<WidgetCommandInterface> = new EventEmitter<WidgetCommandInterface>();
  @Input() model: any;
  @Input() viewType: string;
  @Input() label: any;
  
  constructor() { }

  ngOnInit() {
  }

}
