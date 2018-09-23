import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AuthService, userToken } from "../auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { CrmService } from "../crm.service";

@Component({
  selector: "app-crm",
  templateUrl: "./crm.component.html",
  styleUrls: ["./crm.component.less"]
})
export class CrmComponent implements OnInit, OnDestroy {
  tab = "new";
  crmForm: FormGroup;
  routerSubscription: Subscription;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  list: any[] = [];
  token: userToken;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public crmService: CrmService,
    private httpClient: HttpClient) { }

  addMember(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      const items = this.crmForm.get("members").value;
      items.push(value as any);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeMember(item): void {
    const items = this.crmForm.get("members").value;

    const index = items.indexOf(item);
    if (index >= 0) {
      items.splice(index, 1);
    }
  }

  choose(item) {
    localStorage.setItem("crm", item._id);
    this.router.navigate(["/dashboard"]);
  }
  async saveCrm() {


    await this.httpClient.post<any>(environment.api + "/api/crm/manage/saveCrm", this.crmForm.value, {
      headers: {
        Authorization: "Bearer " + this.token.access_token,
        clientid: environment.clientId
      }
    })
      .toPromise();

    this.router.navigate(['/crm', 'choose']);
  }

  async refresh() {

    this.list = await this.httpClient.get(environment.api + "/api/crm/manage/list", {
      headers: {
        Authorization: "Bearer " + this.token.access_token,
        clientid: environment.clientId
      }
    }).toPromise() as any;
  }

  async handleParams() {

    await this.refresh();
    this.tab = this.activatedRoute.snapshot.params.tab || 'list';

    if (this.tab == 'choose')
      if (this.list.length == 1) {
        localStorage.setItem("crm", this.list[0]._id);

      }

  }
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
  async ngOnInit() {

    this.crmForm = this.fb.group({
      title: ["", Validators.required],
      members: this.fb.array([])
    });
    
    try {
      this.token = await this.authService.token();

    } catch (error) {
      this.router.navigate(['/auth']);
    }




    this.handleParams();

    this.routerSubscription = this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd)
        this.handleParams();
    });

  }



  /**
   * get default crm
   */
  // async crm(): Promise<any> {

  //   const token = await this.authService.token();

  //   const crmList = await this.http
  //     .get<any>(environment.api + "/api/crm/manage/list", {
  //       headers: {
  //         Authorization: "Bearer " + token.access_token,
  //         clientid: environment.clientId
  //       }
  //     })
  //     .toPromise();

  //   if (crmList.length > 0) {
  //     localStorage.setItem("crm", JSON.stringify(crmList[0]));
  //     return crmList[0];
  //   } else { return null; }
  // }

}
