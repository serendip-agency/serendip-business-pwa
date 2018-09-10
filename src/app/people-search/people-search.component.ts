import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.less']
})
export class PeopleSearchComponent implements OnInit {

  constructor() { }

  selectedReportTypes = new FormControl();
  reportTypes: { key: string, label: string }[] = [
    { key: 'field-name', label: 'نام و نام‌خانوادگی' },
    { key: 'field-gender', label: 'جنسیت' },
    { key: 'field-birthDate', label: 'تاریخ تولد و سن' },
    { key: 'field-mobile', label: 'شماره تماس' },
    { key: 'field-email', label: 'ایمیل' },
    { key: 'field-social', label: 'شبکه‌های اجتماعی و ارتباطی' },
    { key: 'field-address', label: 'آدرس اقامت' },
    { key: 'relational-workplace', label: 'محل فعالیت' },
    { key: 'relational-position', label: 'سمت و مرتبه شغلی' },
    { key: 'relational-interaction', label: 'میزان تعاملات' },
  ];

  ngOnInit() {
  }

}
