import { Component, ViewChild, OnInit } from '@angular/core';

import * as _moment from 'jalali-moment';
import { DatePickerComponent } from 'ng2-jalali-date-picker';
import { AuthService } from './auth.service';
import { SyncService } from './sync.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  @ViewChild('dayPicker') datePicker: DatePickerComponent;

  moment: any;
  authService: AuthService;
  startActive: Boolean = false;
  search: { text: String, mode: string } = { text: '', mode: 'contacts' };
  snackBar: MatSnackBar;
  loggedIn: boolean = false;
  routerLoading: boolean;

  constructor(private _authService: AuthService, _activatedRoute: ActivatedRoute, _router: Router, _syncService: SyncService, _snackBar: MatSnackBar) {
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

  clickOnStartWrapper(event: MouseEvent) {
    if ((event.target as HTMLElement).getAttribute('id') === 'start')
      this.startActive = false;
  }
  ngOnInit() {

    this.router.events.subscribe(async (event: any) => {

      this.routerLoading = true;
      if (event instanceof NavigationEnd || event instanceof NavigationCancel){
        this.startActive = false;
        this.routerLoading = false;

      }

    });
    setTimeout(() => {
      this.snackBar.open('همگام سازی شروع شد ...', '', { duration: 1000 });
    }, 1);
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

  }

}
