import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import * as _moment from 'moment-jalaali';
import { AuthService } from './auth.service';
import { SyncService } from './sync.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { BusinessService } from './business.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

  moment: any;
  authService: AuthService;
  snackBar: MatSnackBar;
  loggedIn: boolean = false;
  routerLoading: boolean;

  routerSubscription: Subscription;


  constructor(private crmService: BusinessService, private httpClient: HttpClient, private _authService: AuthService, _activatedRoute: ActivatedRoute, _router: Router, _syncService: SyncService, _snackBar: MatSnackBar) {
    this.snackBar = _snackBar;
    this.moment = _moment;
    this.authService = _authService;
    this.syncService = _syncService;
    this.router = _router;
    this.activatedRoute = _activatedRoute;

    setInterval(() => {
      this.loggedIn = this.authService.loggedIn;
    }, 1000);
  }
  public collectionSynced = [];

  private syncService: SyncService;
  activatedRoute: ActivatedRoute;
  router: Router;

  rpd(input) {
    if (!input)
      input = '';
    var convert = (a) => {
      return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][a];
    }
    return input.toString().replace(/\d/g, convert);
  }


  ngOnDestroy() {

    this.routerSubscription.unsubscribe();

  }


  currentPwa = 'v0.05';

  updatePwa() {
    navigator.serviceWorker.getRegistration().then(function (registration) {

      caches.delete("cache-from-zip");

      if (registration) registration.unregister();

      location.reload();

    });
  }

  ngOnInit() {

    console.log(this.currentPwa);

    this.httpClient.get('versions.json?v=' + Math.random().toString().split('.')[1]).toPromise().then((versions) => {


      console.log('pwa versions', versions);

      if (versions[0] != this.currentPwa) {
        this.updatePwa();
      }
    }).catch(() => { });
    // if (localStorage.getItem("pwa-app-version")) {

    //   if (localStorage.getItem("pwa-app-version") != this.currentPwa)
    //     this.updatePwa();

    // } else {
    //   localStorage.setItem("pwa-app-version", this.currentPwa);
    // }
    // setTimeout(() => {
    //   html2canvas(document.getElementsByClassName("grid-container")[0]).then(canvas => {
    //     document.body.appendChild(canvas)
    //   });
    // }, 2000);

    this.routerSubscription = this.router.events.subscribe(async (event: any) => {

      this.routerLoading = true;
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.routerLoading = false;
      }

    });

    if (this.crmService.getActiveBusinessId() && this.authService.loggedIn)
      setTimeout(() => {
        this.snackBar.open('همگام سازی شروع شد ...', '', { duration: 1000 });
        var syncStart = Date.now();
        // this.syncService
        //   .start({
        //     onCollectionSync: (collection) => {
        //       this.collectionSynced.unshift(collection);
        //       console.log(collection + ' synced');
        //     }
        //   }
        //   )
        //   .then(() => {

        //     this.snackBar.open(`همگام سازی در ${this.rpd(((Date.now() - syncStart) / 1000).toFixed(1))} ثانیه انجام شد.`, '', { duration: 10000 });
        //     //  alert(`sync took ${(Date.now() - syncStart) / 1000} seconds`);
        //   }).catch((e) => {
        //     this.snackBar.open('همگام سازی با خطا مواجه شد.', '', { duration: 3000 });
        //     console.error(e);
        //   });
      }, 3000);


  }

}
