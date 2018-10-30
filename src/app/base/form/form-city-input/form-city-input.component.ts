import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as _ from 'underscore';
import IranStates from '../../../geo/IranStates';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-form-city-input',
  templateUrl: './form-city-input.component.html',
  styleUrls: ['./form-city-input.component.css']
})
export class FormCityInputComponent implements OnInit {

  SelectId = `city-select-${Math.random().toString().split('.')[1]}`


  iranStates: { "name": string; "Cities": { "name": string; }[]; }[] = IranStates;

  filteredCities = [];


  @Output() modelChange = new EventEmitter<any>();

  private _model: string;

  @Input() set model(value: string) {
    this._model = value;
  }

  get model(): string {
    return this._model;
  }


  _state: string;

  @Input() set state(value: string) {
    if (this._state != value) {
      this._state = value;
      this.onBlur();
    }
  }

  get state(): string {
    return this._state;
  }

  onBlur() {
    this.filterCities();

    if (_.where(this.filteredCities, { name: this.model.trim() }).length == 0) {
      this.model = '';
      this.filterCities();

    }


  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.modelChange.emit(event.option.value);

  }

  filterStates(input) {
    return _.filter(this.iranStates, (iState) => {
      return iState.name.indexOf(input) != -1
    })
  }


  filterCities() {
    if (!this.state) {
      this.filteredCities = [];
      return;
    }

    if (this.filterStates(this.state).length == 1)
      this.state = this.filterStates(this.state)[0].name;
    else {
      this.filteredCities = [];
      return;
    }

    this.filteredCities = _.filter(_.findWhere(this.iranStates, { name: this.state }).Cities, (city) => {
      return city.name.indexOf(this.model) != -1
    })
  }


  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterCities();
  }

}
