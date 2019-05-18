import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import * as _moment from 'moment-jalaali';
import { MatSnackBar } from '@angular/material';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  NavigationCancel
} from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

  moment: any;
  snackBar: MatSnackBar;
  loggedIn = false;
  routerLoading: boolean;

  routerSubscription: Subscription;

  constructor(private httpClient: HttpClient, private router: Router) {
    // setInterval(() => {
    //   this.loggedIn = this.authService.loggedIn;
    // }, 1000);
  }

  rpd(input) {
    if (!input) {
      input = '';
    }
    const convert = a => {
      return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  updatePwa() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      caches.delete('cache-from-zip');

      if (registration) {
        registration.unregister();
      }

      location.reload();
    });
  }

  ngOnInit() {


    swal.setDefaults({
      buttonsStyling: false,
      cancelButtonText: 'انصراف',
      confirmButtonText: 'بسیار خب'
    });


    this.routerSubscription = this.router.events.subscribe(
      async (event: any) => {
        this.routerLoading = true;
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.routerLoading = false;
        }
      }
    );
  }
}
