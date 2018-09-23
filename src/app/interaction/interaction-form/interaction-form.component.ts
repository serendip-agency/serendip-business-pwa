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
      firstName: ["", Validators.required],
      lastName: [""],
      address: this.fb.group({
        street: [""],
        city: [""],
        state: [""],
        zip: [""]
      }),
      mobiles: this.fb.array([
        this.fb.group({
          type: [""],
          value: [""]
        })
      ]),
      emails: this.fb.array([this.fb.control("")]),
      socials: this.fb.array([
        this.fb.group({
          type: [""],
          value: [""]
        })
      ]),
      gender: [""]
    });

    this.interactionForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('interaction', params.id);
      console.log(model);
      this.interactionForm.patchValue(model);
      this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }

  }
  handleParams(): any {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
      this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
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
