import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { IdbService } from 'src/app/idb.service';
import * as _ from 'underscore';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-people-select',
  templateUrl: './people-select.component.html',
  styleUrls: ['./people-select.component.css']
})
export class PeopleSelectComponent implements OnInit {


  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef
  ) { }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() modelChange = new EventEmitter<any>();

  async ngOnInit() {
    console.log('ngOnInit model', this.model);


  }

  filteredPeople = [];

  cachedEmployees = [];

  @Input() selectType: 'single' | 'multiple' = 'multiple';


  private _model: string[];


  @Input() set model(value: string[]) {

    console.log('set model', value, this._model);

    value.forEach(async (_id) => {
      this.cachedEmployees[_id] = await this.dataService.details<{ _id: string }>('people', _id);

    });

    if (!this._model) {
      this._model = value;
    } else {
      this._model = value;

    }

  }

  get model(): string[] {

    return this._model;

  }


  getEmployee(_id) {

    if (this.cachedEmployees[_id])
      return this.cachedEmployees[_id];

    return null;

  }


  goEmployee(_id) {
    var person = this.getEmployee(_id);
    this.snackBar.open('اطلاعات موجود از ' + person.firstName + ' ' + person.lastName + ' را میخواهید؟', 'بله', { duration: 2000 }).onAction().subscribe(() => {
      console.log('go to person page');
    });
  }


  removeEmployee(contact, item) {
    this.model.splice(this.model.indexOf(item), 1)
    //  this.modelChange.emit(this.model);

  }

  async selectEmployee(event: MatAutocompleteSelectedEvent) {

    if (this.selectType == "multiple")
      this.model.push(event.option.value);
    else
      this.model = [event.option.value];

    this.cachedEmployees[event.option.value] = await this.dataService.details<{ _id: string }>('people', event.option.value);

    if (this.selectType == "multiple")
      this.modelChange.emit(this.model);
    else
      this.modelChange.emit(this.model[0]);

    //   this.ref.detectChanges();
  }

  // validateEmployees(contact) {
  //   contact.get('peoples').value = _.filter(contact.get('peoples').value, (item: string) => {
  //     return item.length == 24
  //   })
  // }

  async filterPeople(input, currentValues) {
    if (input)
      this.filteredPeople = _.filter(await this.dataService.search('people', input, 10), (item: any) => {
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
