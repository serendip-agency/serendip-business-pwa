import { Component, OnInit, Input } from '@angular/core';
import { CompanyModel } from 'serendip-business-model'
@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css']
})
export class CompanyViewComponent implements OnInit {

  constructor() { }

  @Input() model: CompanyModel;

  ngOnInit() {



  }

}
