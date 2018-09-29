
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GmapsService {
  map: google.maps.Map;
  //&callback=initMap
  googleMapsScriptUrl: string = `https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}`

  constructor() {

  }

  addMapDiv() {

  }

  addMapsScript() {
    if (!document.querySelectorAll(`[src="${this.googleMapsScriptUrl}"]`).length) {
      document.body.appendChild(Object.assign(
        document.createElement('script'), {
          type: 'text/javascript',
          src: this.googleMapsScriptUrl,
          onload: () => this.initMap()
        }));
    } else {
      this.initMap();
    }
  }

  initMap() {

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
    console.info('initMap();');

  }

}
