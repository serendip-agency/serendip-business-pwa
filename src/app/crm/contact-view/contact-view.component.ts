import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WidgetCommandInterface } from 'src/app/models';
import { ContactModel } from 'serendip-business-model';

@Component({
  selector: 'app-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.less']
})
export class ContactViewComponent implements OnInit {


  @Output() widgetCommand: EventEmitter<WidgetCommandInterface> = new EventEmitter<WidgetCommandInterface>();
  @Input() model: ContactModel;

  constructor() { }

  ngOnInit() {
  }

}
