import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { IdbService } from 'src/app/idb.service';
import * as _ from 'underscore';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-form-chips-input',
  templateUrl: './form-chips-input.component.html',
  styleUrls: ['./form-chips-input.component.css']
})
export class FormChipsInputComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef
  ) { }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() modelChange = new EventEmitter<any>();

  async ngOnInit() {
    this.filterEntities(' ', []);
  }

  filteredEntities = [];

  cachedEntities = [];

  @Input() selectType: 'single' | 'multiple' = 'multiple';

  @Input() entityName: string;

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


  getEntity(_id) {

    if (this.cachedEntities[_id])
      return this.cachedEntities[_id];

    return null;

  }


  goEntity(_id) {
    var model = this.getEntity(_id);
    this.snackBar.open('اطلاعات موجود از ' + model._id + ' را میخواهید؟', 'بله', { duration: 2000 }).onAction().subscribe(() => {
      console.log('open details widget');
    });
  }


  removeEntity(contact, item) {
    this.model.splice(this.model.indexOf(item), 1)
    //  this.modelChange.emit(this.model);

  }

  async selectEntity(event: MatAutocompleteSelectedEvent) {

    if (this.selectType == "multiple")
      this.model.push(event.option.value);
    else
      this.model = [event.option.value];

    this.cachedEntities[event.option.value] = await this.dataService.details<{ _id: string }>(this.entityName, event.option.value);

    if (this.selectType == "multiple")
      this.modelChange.emit(this.model);
    else
      this.modelChange.emit(this.model[0]);

    //   this.ref.detectChanges();
  }

  // validateEntities(contact) {
  //   contact.get('companys').value = _.filter(contact.get('companys').value, (item: string) => {
  //     return item.length == 24
  //   })
  // }

  async filterEntities(input, currentValues) {
    if (input)
      this.filteredEntities = _.filter(await this.dataService.search(this.entityName, input, 10), (item: any) => {
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
