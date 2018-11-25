import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactModel } from 'serendip-business-model';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.less']
})
export class ContactsViewComponent implements OnInit {


  @Input() model: ContactModel[] = [];
  @Input() label: string;
  @Input() viewType: string;

  constructor() { }

  ngOnInit() {
  }

}
