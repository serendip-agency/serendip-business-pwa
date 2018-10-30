import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { widgetCommandInterface } from 'src/app/models';

@Component({
  selector: 'app-short-text-view',
  templateUrl: './short-text-view.component.html',
  styleUrls: ['./short-text-view.component.less']
})
export class ShortTextViewComponent implements OnInit {

  @Output() widgetCommand: EventEmitter<widgetCommandInterface> = new EventEmitter<widgetCommandInterface>();
  @Input() model: any;
  constructor() { }

  ngOnInit() {
  }

}
