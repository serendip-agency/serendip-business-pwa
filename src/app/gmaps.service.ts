
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { environment } from '../environments/environment';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class GmapsService {

  private map: google.maps.Map;
  private googleMapsScriptUrl: string = `https://maps.googleapis.com/maps/api/js?language=fa-IR&key=${environment.googleApiKey}`
  private selectPositionCallback: any;
  private selectedPosition: any;
  private selectedPositionMarker: google.maps.Marker;
  public events: EventEmitter = new EventEmitter();

  private lastPosition = null;

  mapClickListener: google.maps.MapsEventListener;

  addMapsScript(callback) {
    if (!document.querySelectorAll(`[src="${this.googleMapsScriptUrl}"]`).length) {
      document.body.appendChild(Object.assign(
        document.createElement('script'), {
          type: 'text/javascript',
          src: this.googleMapsScriptUrl,
          onload: () => this.initMap(callback)
        }));
    } else {
      this.initMap(callback);
    }
  }

  selectPositionDone() {
    this.events.emit("mapClose");
    if (this.selectPositionCallback)
      this.selectPositionCallback(this.selectedPosition);
  }

  selectPositionCancel() {


    if (this.selectedPositionMarker) {


      if (this.lastPosition) {


        if (
          this.lastPosition.lat + ',' + this.lastPosition.lng == this.selectedPositionMarker.getPosition().toUrlValue()
        ) {

          this.events.emit("mapClose");
          if (this.selectPositionCallback)
            this.selectPositionCallback(undefined);

        } else {

          this.selectedPositionMarker.setPosition(this.lastPosition);
          this.map.panTo(this.lastPosition);
          this.selectedPosition = null;


        }

      } else {
        this.selectedPositionMarker.setMap(null);
        this.selectedPositionMarker = null;
        this.selectedPosition = null;
      }

      this.events.emit('selectedPositionChange', this.selectedPosition);

    } else {
      this.events.emit("mapClose");
      if (this.selectPositionCallback)
        this.selectPositionCallback(undefined);
    }

  }

  selectPosition(position, callback) {

    this.events.emit("mapOpen");

    this.events.emit('selectPosition');



    this.addMapsScript(() => {

      this.selectPositionCallback = callback;

      if (position && position.indexOf(',') != -1) {
        this.lastPosition = {
          lat: parseFloat(position.split(',')[0]),
          lng: parseFloat(position.split(',')[1])
        };
        this.placeMarkerAndPanTo(this.lastPosition, this.map);
      }

      this.mapClickListener = this.map.addListener('click', (e) => {

        this.selectedPosition = (e.latLng as google.maps.LatLng).toUrlValue();
        this.events.emit('selectedPositionChange', this.selectedPosition);
        this.placeMarkerAndPanTo(e.latLng, this.map);

      });

    });
  }

  private placeMarkerAndPanTo(latLng, map) {

    if (!this.selectedPositionMarker)
      this.selectedPositionMarker = new google.maps.Marker({
        position: latLng,
        map: map
      });
    else this.selectedPositionMarker.setPosition(latLng);

    map.panTo(latLng);

  }
  private initMap(callback) {

    if (!this.map)
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.739435, lng: 51.218017 },
        zoom: 14,
        styles: [{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#e5ba63" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "saturation": -31 }, { "lightness": -33 }, { "weight": 2 }, { "gamma": 0.8 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "lightness": 30 }, { "saturation": 30 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "saturation": "5" }, { "lightness": "55" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "lightness": "42" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{ "lightness": "37" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "saturation": 20 }] }, { "featureType": "poi.attraction", "elementType": "geometry.fill", "stylers": [{ "lightness": "38" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "lightness": "41" }] }, { "featureType": "poi.government", "elementType": "geometry.fill", "stylers": [{ "lightness": "39" }] }, { "featureType": "poi.medical", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "lightness": 20 }, { "saturation": -20 }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#818b5f" }, { "lightness": "39" }, { "saturation": "19" }] }, { "featureType": "poi.place_of_worship", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "poi.school", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "poi.sports_complex", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 10 }, { "saturation": -30 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "saturation": 25 }, { "lightness": 25 }] }, { "featureType": "transit.station", "elementType": "geometry.fill", "stylers": [{ "lightness": "41" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "lightness": -20 }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "gamma": "1.10" }, { "hue": "#00ff97" }, { "saturation": "-82" }, { "lightness": "40" }] }]

      } as any);

    if (this.mapClickListener)
      this.mapClickListener.remove();

    if (this.selectedPositionMarker) {
      this.selectedPositionMarker.setMap(null);
      this.selectedPositionMarker = null;
    }

    this.lastPosition = null;


    this.selectedPosition = null;

    this.events.emit("mapInitDone");

    callback();
  }

}
