
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { environment } from '../environments/environment';
import { EventEmitter } from 'events';
import { Observable, observable } from 'rxjs';



export interface GmapEventInterface {

  mapId: string;

}

@Injectable({
  providedIn: 'root'
})
export class GmapsService {

  private scriptUrl: string = `https://maps.googleapis.com/maps/api/js?language=fa-IR&key=${environment.googleApiKey}`

  private eventEmitter: EventEmitter = new EventEmitter();

  mapClickListener: google.maps.MapsEventListener;

  scriptLoaded: boolean = false;

  private addScripts(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!document.querySelectorAll(`[src="${this.scriptUrl}"]`).length) {
        document.body.appendChild(Object.assign(
          document.createElement('script'), {
            type: 'text/javascript',
            src: this.scriptUrl,
            onload: () => {
              this.scriptLoaded = true;
              this.eventEmitter.emit("scriptLoad");
              resolve();
            },
            onerror: (e) => {
              this.eventEmitter.emit("scriptError", e);
              reject(e);
            }
          }));
      } else {
        this.eventEmitter.on('scriptLoad', () => {
          resolve();
        });

        this.eventEmitter.on('scriptError', (e) => {
          reject(e);
        });
      }

    });
  }

  public emitSelectCancel(event: { mapId: string }) {
    this.eventEmitter.emit("cancel", event);
  }

  public emitSelectDone(event: { mapId: string, positions: { lat: number, lng: number }[] }) {

    this.eventEmitter.emit("selectDone", event);
  }


  public selectSingle(mapId: string, positions: { lat: number, lng: number }[]) {

    this.eventEmitter.emit("selectSingle", { mapId, positions });

  }



  public subscribeOnSelectSingle(mapId: string): Observable<{ lat: number, lng: number }[]> {

    return new Observable((obServer) => {

      this.eventEmitter.on("selectSingle", (event: { mapId: string, positions: any }) => {

        if (event.mapId == mapId)
          obServer.next(event.positions);

      });

    });
  }



  public subscribeOnSetMode(mapId: string): Observable<string> {

    return new Observable((obServer) => {

      this.eventEmitter.on("setMode", (event: { mapId: string, mode: string }) => {

        if (event.mapId == mapId)
          obServer.next(event.mode);

      });

    });
  }



  public subscribeOnSetMarkers(mapId: string): Observable<{ lat: number, lng: number }[]> {


    return new Observable((obServer) => {

      this.eventEmitter.on("setMarkers", (event: { mapId: string, positions: any }) => {

        if (event.mapId == mapId)
          obServer.next(event.positions);

      });

    });
  }



  public subscribeOnSetVisible(mapId: string): Observable<boolean> {

    return new Observable((obServer) => {

      this.eventEmitter.on("setVisible", (event: { mapId: string, visible: boolean }) => {

        if (event.mapId == mapId)
          obServer.next(event.visible);

      });

    });

  }


  public onSelectDone(mapId: string): Promise<{ lat: number, lng: number }[]> {

    return new Promise((resolve, reject) => {

      this.eventEmitter.on("selectDone", (event: { mapId: string, positions: { lat: number, lng: number }[] }) => {

        if (event.mapId == mapId)
          resolve(event.positions);

      });
    });
  }

  async newMap(opts: {
    mapWrapper: HTMLElement,
    center?: {
      lat: number, lng: number
    },
    zoom?: number,
    styles?: any
  }): Promise<google.maps.Map> {

    await this.addScripts();

    var _opts = {
      center: { lat: opts.center ? opts.center.lat : false || 35.739435, lng: opts.center ? opts.center.lng : false || 51.218017 },
      zoom: opts.zoom || 14,
      styles: opts.styles || [{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#e5ba63" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "saturation": -31 }, { "lightness": -33 }, { "weight": 2 }, { "gamma": 0.8 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "lightness": 30 }, { "saturation": 30 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "saturation": "5" }, { "lightness": "55" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "lightness": "42" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{ "lightness": "37" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "saturation": 20 }] }, { "featureType": "poi.attraction", "elementType": "geometry.fill", "stylers": [{ "lightness": "38" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "lightness": "41" }] }, { "featureType": "poi.government", "elementType": "geometry.fill", "stylers": [{ "lightness": "39" }] }, { "featureType": "poi.medical", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "lightness": 20 }, { "saturation": -20 }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#818b5f" }, { "lightness": "39" }, { "saturation": "19" }] }, { "featureType": "poi.place_of_worship", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "poi.school", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "poi.sports_complex", "elementType": "geometry.fill", "stylers": [{ "lightness": "40" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 10 }, { "saturation": -30 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "saturation": 25 }, { "lightness": 25 }] }, { "featureType": "transit.station", "elementType": "geometry.fill", "stylers": [{ "lightness": "41" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "lightness": -20 }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "gamma": "1.10" }, { "hue": "#00ff97" }, { "saturation": "-82" }, { "lightness": "40" }] }]
    };

    console.log("map instance being created with options:", _opts);

    var map = new google.maps.Map(opts.mapWrapper, _opts);

    return map;

  }



  // selectPositionDone() {
  //   this.events.emit("mapClose");
  //   if (this.selectPositionCallback)
  //     this.selectPositionCallback(this.selectedPosition);
  // }

  // selectPositionCancel() {


  //   if (this.selectedPositionMarker) {


  //     if (this.lastPosition) {


  //       if (
  //         this.lastPosition.lat + ',' + this.lastPosition.lng == this.selectedPositionMarker.getPosition().toUrlValue()
  //       ) {

  //         this.events.emit("mapClose");
  //         if (this.selectPositionCallback)
  //           this.selectPositionCallback(undefined);

  //       } else {

  //         this.selectedPositionMarker.setPosition(this.lastPosition);
  //         this.map.panTo(this.lastPosition);
  //         this.selectedPosition = null;


  //       }

  //     } else {
  //       this.selectedPositionMarker.setMap(null);
  //       this.selectedPositionMarker = null;
  //       this.selectedPosition = null;
  //     }

  //     this.events.emit('selectedPositionChange', this.selectedPosition);

  //   } else {
  //     this.events.emit("mapClose");
  //     if (this.selectPositionCallback)
  //       this.selectPositionCallback(undefined);
  //   }

  // }

  // selectPosition(position, callback) {

  //   this.events.emit("mapOpen");

  //   this.events.emit('selectPosition');



  //   this.addMapsScript(() => {

  //     this.selectPositionCallback = callback;

  //     if (position && position.indexOf(',') != -1) {
  //       this.lastPosition = {
  //         lat: parseFloat(position.split(',')[0]),
  //         lng: parseFloat(position. split(',')[1])
  //       };
  //       this.placeMarkerAndPanTo(this.lastPosition, this.map);
  //     }

  //     this.mapClickListener = this.map.addListener('click', (e) => {

  //       this.selectedPosition = (e.latLng as google.maps.LatLng).toUrlValue();
  //       this.events.emit('selectedPositionChange', this.selectedPosition);
  //       this.placeMarkerAndPanTo(e.latLng, this.map);

  //     });

  //   });
  // }


}
