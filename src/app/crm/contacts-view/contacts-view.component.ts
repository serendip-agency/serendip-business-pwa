import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.less']
})
export class ContactsViewComponent implements OnInit {


  @Input() model: any[] = [];
  @Input() label: string;
  @Input() viewType: string;

  constructor() { }

  ngOnInit() {
  }

}
