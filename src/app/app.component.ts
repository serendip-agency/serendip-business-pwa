import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";

import * as _moment from "moment-jalaali";
import { AuthService } from "./auth.service";
import { MatSnackBar } from "@angular/material";
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  NavigationCancel
} from "@angular/router";
import { BusinessService } from "./business.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import swal from "sweetalert2";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit, OnDestroy {
  currentPwa = "v0.05";

  moment: any;
  snackBar: MatSnackBar;
  loggedIn = false;
  routerLoading: boolean;

  routerSubscription: Subscription;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    setInterval(() => {
      this.loggedIn = this.authService.loggedIn;
    }, 1000);
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
    navigator.serviceWorker.getRegistration().then(function(registration) {
      caches.delete("cache-from-zip");

      if (registration) {
        registration.unregister();
      }

      location.reload();
    });
  }

  ngOnInit() {
    console.log("current version of PWA is " + this.currentPwa);

    swal.setDefaults({
      buttonsStyling: false,
      cancelButtonText: "انصراف",
      confirmButtonText: "بسیار خب"
    });

    this.httpClient
      .get(
        "versions.json?v=" +
          Math.random()
            .toString()
            .split(".")[1]
      )
      .toPromise()
      .then(versions => {
        console.log("pwa versions", versions);

        if (versions[0] !== this.currentPwa) {
          this.updatePwa();
        }
      })
      .catch(() => {});
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
