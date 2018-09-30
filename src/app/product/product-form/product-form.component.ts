import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.css"]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;

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
    if (!this.productForm.value._id) {
      this.dataService.insert("product", this.productForm.value);
    } else {
      this.dataService.update("product", this.productForm.value);
    }
  }

  reset() {
    this.productForm.reset();
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


    this.productForm = this.fb.group({
      _id: [""],
      name: ["", Validators.required],
      company: [""],
      price: [""],
      currency  : [""]
    });

    this.productForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('product', params.id);
      console.log(model);
      this.productForm.patchValue(model);
 //     this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }

  }
  handleParams(): any {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
     // this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }
  }

  addMobile() {
    (this.productForm.controls.mobiles as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeMobile(index: number) {
    (this.productForm.controls.mobiles as FormArray).removeAt(index);
  }

  addSocial() {
    (this.productForm.controls.socials as FormArray).push(
      this.fb.group({
        type: [""],
        value: [""]
      })
    );
  }

  removeSocial(index: number) {
    (this.productForm.controls.socials as FormArray).removeAt(index);
  }
}
