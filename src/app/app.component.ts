import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import * as _moment from 'moment-jalaali';
import { AuthService } from './auth.service';
import { SyncService } from './sync.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { CrmService } from './crm.service';
import { Subscription } from 'rxjs';

import * as html2canvas from 'html2canvas';


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


  constructor(private crmService: CrmService, private _authService: AuthService, _activatedRoute: ActivatedRoute, _router: Router, _syncService: SyncService, _snackBar: MatSnackBar) {
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
  ngOnInit() {

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

    if (this.crmService.getActiveCrmId() && this.authService.loggedIn)
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
