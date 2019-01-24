import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  MatChipInputEvent,
  MatSnackBarRef,
  MatSnackBar
} from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AuthService } from "../auth.service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { BusinessService } from "../business.service";
import { environment } from "../../environments/environment";
import { DataService } from "../data.service";
import { DashboardService } from "../dashboard.service";
import { TokenModel } from "serendip";

@Component({
  selector: "app-business",
  templateUrl: "./business.component.html",
  styleUrls: ["./business.component.less"]
})
export class BusinessComponent implements OnInit, OnDestroy {
  tab = "new";

  model = { title: "" };
  routerSubscription: Subscription;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  list: any[] = [];
  token: TokenModel;
  businessesToSelect = [];

  memberToAdd = { mobile: "", code: "+98" };

  businessModel = {};

  currentBusiness = null;
  loading = true;

  lastListReq = 0;
  offline: boolean;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    public dataService: DataService
  ) {}

  addMember() {
    this.loading = true;

    this.dataService
      .request({
        method: "POST",
        path: "/api/business/addMember",
        model: {
          mobile: this.memberToAdd.mobile,
          mobileCountryCode: this.memberToAdd.code
        }
      })
      .then(async res => {
        console.log(res);
        this.snackBar.open("کاربر جدید اضافه شد!", "", { duration: 3000 });

        await this.dataService.loadBusiness();
        this.memberToAdd = { code: "+98", mobile: "" };
        this.loading = false;
      })
      .catch(res => {
        if (res.error) {
          if (res.error.description == "duplicate") {
            this.snackBar.open(
              "این کاربر قبلا به کسب‌وکار اضافه شده است!",
              "",
              { duration: 3000 }
            );
          } else {
            if (res.status == 400) {
              return this.snackBar.open("موبایل و کد رو بازبینی کنید!", "", {
                duration: 3000
              });
            }

            if (res.status == 0) {
              return this.snackBar.open("اتصال شبکه شما قطع است!", "", {
                duration: 3000
              });
            } else {
              return this.snackBar.open("لطفا لحظاتی دیگر تلاش کنید!", "", {
                duration: 3000
              });
            }
          }
        }
        this.loading = false;
      });
  }

  choose(id) {
    localStorage.setItem("business", id);
    this.router.navigate(["/dashboard"]);
  }

  async saveBusiness() {
    await this.dataService.request({
      method: "POST",
      model: this.model,
      path: "/api/business/saveBusiness",
      retry: false
    });

    this.router.navigate(["/business", "list"]);
  }

  sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
  async refresh() {
    this.loading = true;

    await this.sleep();

    if ((this.tab === "new" && this.list.length === 0) || this.tab === "list") {
      if (Date.now() - this.lastListReq > 500) {
        this.lastListReq = Date.now();
        try {
          this.list = await this.dataService.request({
            method: "get",
            retry: false,
            path: "/api/business/list"
          });

          this.offline = false;
          this.loading = false;
          console.log(this.list);
        } catch (error) {
          this.offline = true;
          this.loading = false;
        }
      }
    }

    // await this.sleep();

    if (this.list && this.list.map) {
      this.businessesToSelect = this.list.map(item => {
        return { label: item.title, value: item._id };
      });
    }
  }
  async handleParams() {
    this.tab = this.activatedRoute.snapshot.params.tab || "list";

    await this.refresh();

    console.log(this.list);

    if (!this.offline && this.list.length === 0) {
      this.router.navigate(["/business", "new"]);
    }

    this.loading = false;

    // if (this.tab === "choose") {
    //   if (this.list.length === 1) {
    //     localStorage.setItem("business", this.list[0]._id);
    //   }
    // }
  }
  ngOnDestroy() {
    if (this.routerSubscription && this.routerSubscription.unsubscribe) {
      this.routerSubscription.unsubscribe();
    }
  }
  async ngOnInit() {
    try {
      this.token = await this.authService.token();

      if (this.router.url.indexOf("/business") !== -1) {
        await this.handleParams();
        this.routerSubscription = this.routerSubscription = this.router.events.subscribe(
          (event: any) => {
            if (event instanceof NavigationEnd) {
              this.handleParams();
            }
          }
        );
      } else await this.refresh();
    } catch (error) {
      this.router.navigate(["/auth"]);
    }

    this.loading = false;
  }

  /**
   * get default business
   */
  // async business(): Promise<any> {

  //   const token = await this.authService.token();

  //   const businessList = await this.http
  //     .get<any>(environment.api + "/api/business/manage/list", {
  //       headers: {
  //         Authorization: "Bearer " + token.access_token,
  //         clientid: environment.clientId
  //       }
  //     })
  //     .toPromise();

  //   if (businessList.length > 0) {
  //     localStorage.setItem("business", JSON.stringify(businessList[0]));
  //     return businessList[0];
  //   } else { return null; }
  // }
}
