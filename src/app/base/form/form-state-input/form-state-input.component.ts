 
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import IranStates from '../../../geo/IranStates';
import * as _ from 'underscore'; 
import { MatAutocompleteSelectedEvent } from '@angular/material';


@Component({
  selector: 'app-form-state-input',
  templateUrl: './form-state-input.component.html',
  styleUrls: ['./form-state-input.component.css']
})
export class FormStateInputComponent implements OnInit {

  @Output() modelChange = new EventEmitter<any>();
  SelectId = `state-select-${Math.random().toString().split('.')[1]}`

  private _model: string;

  iranStates: { "name": string; "Cities": { "name": string; }[]; }[] = IranStates;

  filteredStates = [];

  @Input() set model(value: string) {
    this._model = value;
  }

  get model(): string {
    return this._model;
  }


  onBlur(event) {
    this.filterStates();

    if (_.where(this.filteredStates, { name: this.model.trim() }).length == 0) {
      this.model = '';
    }


  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.modelChange.emit(event.option.value);

  }

  filterStates() {
    this.filteredStates = _.filter(this.iranStates, (iState) => {
      return iState.name.indexOf(this.model) != -1
    })
  }




  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterStates();
  }

}
