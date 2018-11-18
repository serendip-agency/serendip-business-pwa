import { Component, OnInit, Input } from '@angular/core';
import { TriggerModel } from 'serendip-business-model';

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.less']
})
export class TriggersComponent implements OnInit {

  constructor() { }

  notificationTypes = [
    { value: 'sms', label: 'ارسال پیامک' },
    { value: 'email', label: 'ارسال ایمیل' },
    { value: 'push', label: 'ارسال اعلان تحت وب' },
    { value: 'fax', label: 'ارسال فکس' }
  ];

  @Input() label = 'نمونه';
  @Input() mode: 'list' | 'model' = 'list'


  @Input() model: TriggerModel | any = {};
  ngOnInit() {
  }

}
