import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WidgetCommandInterface } from 'src/app/models';
import { ContactModel } from 'serendip-business-model';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.less']
})
export class ContactsViewComponent implements OnInit {


  @Output() widgetCommand: EventEmitter<WidgetCommandInterface> = new EventEmitter<WidgetCommandInterface>();
  @Input() model: ContactModel[] = [];
  @Input() label: string;
  @Input() viewType: string;

  constructor() { }

  ngOnInit() {
  }

}
