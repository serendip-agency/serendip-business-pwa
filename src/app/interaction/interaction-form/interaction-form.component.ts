import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-interaction-form",
  templateUrl: "./interaction-form.component.html",
  styleUrls: ["./interaction-form.component.css"]
})
export class InteractionFormComponent implements OnInit {
  interactionForm: FormGroup;

  model: any = {
    socials: [],
    emails: []
  };
  routerSubscription: Subscription;

  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  constructor(
    private messagingService: MessagingService,
    public fb: FormBuilder,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) { }

  save() {
    if (!this.interactionForm.value._id) {
      this.dataService.insert("interaction", this.interactionForm.value);
    } else {
      this.dataService.update("interaction", this.interactionForm.value);
    }
  }

  reset() {
    this.interactionForm.reset();
  }

  getFormArray(form, arrayName) {
    return (form as any).get(arrayName).controls;
  }

  async ngOnInit() {

    // this.routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.handleParams();
    //   }
    // });

    const params = this.activatedRoute.snapshot.params;


    this.interactionForm = this.fb.group({
      _id: [""],
      user: [""],
      company: [""],
      person: [""],
      sessionId: [""],
      sessionProvider: [""],
      type: ['', Validators.required],
      campaignTrees: this.fb.array([
        this.fb.group({
          // utm_campaign should be campaign id of existing record in database
          campaign: [""],
          // utm_source ex: google, newsletter
          source: [""],
          // utm_medium ex: banner, cpc, email
          medium: [""],
          // utm_content will be used for A/B testing ex: google-ad-1, logoWeb 
          content: [""],
        })
      ]),
      path: [""],
      submitDate: [""],
      interactDate: [""],
      sales: this.fb.array([]),
      tempSale: [''],
      services: this.fb.array([]),
      tempService: [''],
      complaints: this.fb.array([]),
      tempComplaint: [''],
    });

    this.interactionForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('interaction', params.id);
      console.log(model);
      this.interactionForm.patchValue(model);
      //this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }

  }
  handleParams(): any {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
      //  this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }
  }

  addMobile() {
    (this.interactionForm.controls.mobiles as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeMobile(index: number) {
    (this.interactionForm.controls.mobiles as FormArray).removeAt(index);
  }

  addSocial() {
    (this.interactionForm.controls.socials as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeSocial(index: number) {
    (this.interactionForm.controls.socials as FormArray).removeAt(index);
  }
}
