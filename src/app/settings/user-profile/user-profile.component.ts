import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-user-profle",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;

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
    if (!this.userForm.value._id) {
      this.dataService.insert("user", this.userForm.value);
    } else {
      this.dataService.update("user", this.userForm.value);
    }
  }

  reset() {
    this.userForm.reset();
  }


  async ngOnInit() {


    this.userForm = this.fb.group({
      _id: [""],
      firstName: ["", Validators.required],
      lastName: [""],
      gender: [""],
      profilePicture : [""]
    });

    // this.routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.handleParams();
    //   }
    // });

    const params = this.activatedRoute.snapshot.params;

    this.userForm.valueChanges.subscribe(data => { });

    if (params.id) {
      var model = await this.dataService.details('user', params.id);
      console.log(model);
      this.userForm.patchValue(model);
     // this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }
  }

  handleParams(): any {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
     // this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
    }
  }

  fileChanged(event, property, resizeWidth?) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const img = document.createElement('img');
      const type = 'image/jpeg';
      const quality = 0.92;

      resizeWidth = resizeWidth || 768;

      img.onload = () => {
        const oc = document.createElement('canvas'),
          octx = oc.getContext('2d');
        oc.width = img.width;
        oc.height = img.height;
        octx.drawImage(img, 0, 0);
        while (oc.width * 0.5 > resizeWidth) {
          oc.width *= 0.5;
          oc.height *= 0.5;
          octx.drawImage(oc, 0, 0, oc.width, oc.height);
        }

        oc.width = resizeWidth;
        oc.height = (oc.width * img.height) / img.width;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        const resizedDataUrl = oc.toDataURL(type, quality);

        // setting resized base64 to object property

        var toPatch = {};

        toPatch[property] = resizedDataUrl;

        this.userForm.patchValue(toPatch);

      };
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }




}
