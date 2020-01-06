import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";

import * as _moment from "moment-jalaali";
import { MatSnackBar } from "@angular/material";
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  NavigationCancel
} from "@angular/router";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { DataService } from './data.service';
import { BusinessService } from './business.service';
import { AuthService } from './auth.service';
import { ObService } from './ob.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit, OnDestroy {
  envoirement = environment;
  moment: any;
  snackBar: MatSnackBar;
  loggedIn = false;
  routerLoading: boolean;

  routerSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private businessService: BusinessService,
    private authService: AuthService,
    private obService: ObService,
    private router: Router
  ) {
    // setInterval(() => {
    //   this.loggedIn = this.authService.loggedIn;
    // }, 1000);

    console.log("env", environment);
  }

  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  updatePwa() {
    navigator.serviceWorker.getRegistration().then(function (registration) {
      caches.delete("cache-from-zip");

      if (registration) {
        registration.unregister();
      }

      location.reload();
    });
  }

  ngOnInit() {

    swal.setDefaults({
      buttonsStyling: false,
      cancelButtonText: "Cancel",
      confirmButtonText: "OK"
    });

    this.routerSubscription = this.router.events.subscribe(
      async (event: any) => {
        this.routerLoading = true;


        if (!this.authService.loggedIn) {
          this.routerLoading = true;
          (async () => {

            this.routerLoading = false;

          })().then(() => { }).catch(console.error);
        }

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
