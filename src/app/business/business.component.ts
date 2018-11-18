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

@Component({
  selector: "app-business",
  templateUrl: "./business.component.html",
  styleUrls: ["./business.component.less"]
})
export class BusinessComponent implements OnInit, OnDestroy {
  tab = "new";
  businessForm: FormGroup;
  routerSubscription: Subscription;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  list: any[] = [];
  token: userToken;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public businessService: BusinessService,
    private httpClient: HttpClient
  ) {}

  addMember(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      const items = this.businessForm.get("members").value;
      items.push(value as any);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeMember(item): void {
    const items = this.businessForm.get("members").value;

    const index = items.indexOf(item);
    if (index >= 0) {
      items.splice(index, 1);
    }
  }

  choose(item) {
    localStorage.setItem("business", item._id);
    this.router.navigate(["/dashboard"]);
  }
  async saveBusiness() {
    await this.httpClient
      .post<any>(
        environment.api + "/api/business/saveBusiness",
        this.businessForm.value,
        {
          headers: {
            Authorization: "Bearer " + this.token.access_token,
            clientid: environment.clientId
          }
        }
      )
      .toPromise();

    this.router.navigate(["/business", "choose"]);
  }

  async refresh() {
    this.list = (await this.httpClient
      .get(environment.api + "/api/business/list", {
        headers: {
          Authorization: "Bearer " + this.token.access_token,
          clientid: environment.clientId
        }
      })
      .toPromise()
      .catch(e => {
        // FIXME:
        if (e.code == 401) localStorage.clear();
      })) as any;
  }

  async handleParams() {
    await this.refresh();

    this.tab = this.activatedRoute.snapshot.params.tab || "list";

    if (this.tab == "choose")
      if (this.list.length == 1) {
        localStorage.setItem("business", this.list[0]._id);
      }
  }
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
  async ngOnInit() {
    this.businessForm = this.fb.group({
      title: ["", Validators.required],
      members: this.fb.array([])
    });

    try {
      this.token = await this.authService.token();
      await this.handleParams();
    } catch (error) {
      this.router.navigate(["/auth"]);
    }

    this.routerSubscription = this.routerSubscription = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) this.handleParams();
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
