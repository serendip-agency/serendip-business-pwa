import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-service-form",
  templateUrl: "./service-form.component.html",
  styleUrls: ["./service-form.component.css"]
})
export class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;

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
    if (!this.serviceForm.value._id) {
      this.dataService.insert("service", this.serviceForm.value);
    } else {
      this.dataService.update("service", this.serviceForm.value);
    }
  }

  reset() {
    this.serviceForm.reset();
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


    this.serviceForm = this.fb.group({
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

    this.serviceForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('service', params.id);
      console.log(model);
      this.serviceForm.patchValue(model);
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
    (this.serviceForm.controls.mobiles as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeMobile(index: number) {
    (this.serviceForm.controls.mobiles as FormArray).removeAt(index);
  }

  addSocial() {
    (this.serviceForm.controls.socials as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeSocial(index: number) {
    (this.serviceForm.controls.socials as FormArray).removeAt(index);
  }
}
