import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WidgetCommandInterface } from 'src/app/models';

@Component({
  selector: 'app-short-text-view',
  templateUrl: './short-text-view.component.html',
  styleUrls: ['./short-text-view.component.less']
})
export class ShortTextViewComponent implements OnInit {

  @Output() widgetCommand: EventEmitter<WidgetCommandInterface> = new EventEmitter<WidgetCommandInterface>();
  @Input() model: any;
  @Input() label: any;
  @Input() viewType: string;

  constructor() { }

  ngOnInit() {
  }

}
