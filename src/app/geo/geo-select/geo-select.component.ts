import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as _ from 'underscore';
import IranStates from '../IranStates';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { GmapsService } from 'src/app/gmaps.service';


@Component({
  selector: 'app-geo-select',
  templateUrl: './geo-select.component.html',
  styleUrls: ['./geo-select.component.css']
})
export class GeoSelectComponent implements OnInit {

  @Output() modelChange = new EventEmitter<any>();
  SelectId = `geo-select-${Math.random().toString().split('.')[1]}`
  mapId = `gmap-${Date.now()}`;

  private _model: string;

  iranStates: { "name": string; "Cities": { "name": string; }[]; }[] = IranStates;


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
    }
  }

  get state(): string {
    return this._state;
  }

  _city: string;
  @Input() set city(value: string) {
    if (this._city != value) {
      this._city = value;
    }
  }

  get city(): string {
    return this._city;
  }



  constructor(private changeRef: ChangeDetectorRef,
    private gmapsService: GmapsService) { }

  ngOnInit() {

  }


  async  setGeo() {

    var defaultPositions = [];

    var lastValue = this.model;

    if (lastValue) {

      defaultPositions.push({ lat: parseFloat(lastValue.split(',')[0]), lng: parseFloat(lastValue.split(',')[1]) });

    }

    this.gmapsService.selectSingle(this.mapId, defaultPositions);

    var positions = await this.gmapsService.onSelectDone(this.mapId);


    this.model = positions[0].lat + ',' + positions[0].lng;

    this.modelChange.emit(this.model);

    // navigator.geolocation.getCurrentPosition((data) => {
    //   contact.get('address').get('geo').setValue(data.coords.latitude + ',' + data.coords.longitude)
    //   console.log(data);
    // }, (error) => {
    //   console.error(error);
    // });
  }

  goGeo() {
    window.open(`https://www.google.com/maps/@${this.model},16z?hl=fa`, '_blank');
  }

}
