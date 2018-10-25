import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { IdbService } from 'src/app/idb.service';
import * as _ from 'underscore';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css']
})
export class CompanySelectComponent implements OnInit {


  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef
  ) { }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() modelChange = new EventEmitter<any>();

  async ngOnInit() {
    this.filterCompanies(' ', []);
  }

  filteredCompanies = [];

  cachedCompanies = [];

  @Input() selectType: 'single' | 'multiple' = 'multiple';


  private _model: string[];


  @Input() set model(value: string[]) {

    if (!value)
      return;

    value = _.filter(value, (item) => { return item != undefined });


    if (!this._model) {
      this._model = value;
    } else {
      this._model = value;
    }

  }

  get model(): string[] {

    return this._model;

  }


  getCompany(_id) {

    if (this.cachedCompanies[_id])
      return this.cachedCompanies[_id];

    return null;

  }


  goCompany(_id) {
    var person = this.getCompany(_id);
    this.snackBar.open('اطلاعات موجود از ' + person.firstName + ' ' + person.lastName + ' را میخواهید؟', 'بله', { duration: 2000 }).onAction().subscribe(() => {
      console.log('go to person page');
    });
  }


  removeCompany(contact, item) {
    this.model.splice(this.model.indexOf(item), 1)
    //  this.modelChange.emit(this.model);

  }

  async selectCompany(event: MatAutocompleteSelectedEvent) {

    if (this.selectType == "multiple")
      this.model.push(event.option.value);
    else
      this.model = [event.option.value];

    this.cachedCompanies[event.option.value] = await this.dataService.details<{ _id: string }>('company', event.option.value);

    if (this.selectType == "multiple")
      this.modelChange.emit(this.model);
    else
      this.modelChange.emit(this.model[0]);

    //   this.ref.detectChanges();
  }

  // validateCompanies(contact) {
  //   contact.get('companys').value = _.filter(contact.get('companys').value, (item: string) => {
  //     return item.length == 24
  //   })
  // }

  async filterCompanies(input, currentValues) {
    if (input)
      this.filteredCompanies = _.filter(await this.dataService.search('company', input, 10), (item: any) => {
        return currentValues.indexOf(item._id) == -1;
      });

  }



  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

}
