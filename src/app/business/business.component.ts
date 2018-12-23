import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AuthService, userToken } from "../auth.service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { BusinessService } from "../business.service";
import { environment } from "../../environments/environment";
import { DataService } from "../data.service";
import { DashboardService } from "../dashboard.service";

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
  token: userToken;
  businessesToSelect = [];
  currentBusiness = null;
  loading = true;

  lastListReq = 0;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
    public dataService: DataService
  ) { }

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
    if ((this.tab == "new" && this.list.length == 0) || this.tab == "list") {

      if (Date.now() - this.lastListReq > 500) {
        this.lastListReq = Date.now();
        this.list = await this.dataService.request({
          method: "get",
          retry: false,
          path: "/api/business/list"
        });

        console.log(this.list);

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
    this.loading = true;

    this.tab = this.activatedRoute.snapshot.params.tab || "list";

    await this.refresh();
    this.loading = false;

    console.log(this.list);

    if (this.list.length === 0) {
      this.tab = "new";
    }

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
      await this.handleParams();
    } catch (error) {
      this.router.navigate(["/auth"]);
    }

    this.loading = false;

    this.routerSubscription = this.routerSubscription = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.handleParams();
        }
      }
    );
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
