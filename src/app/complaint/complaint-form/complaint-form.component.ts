import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";

import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatChipInput, MatChipList, MatSnackBar } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from 'underscore';
import * as Moment from 'moment-jalaali'
import { ComplaintModel } from "serendip-crm-model";

@Component({
  selector: "app-complaint-form",
  templateUrl: "./complaint-form.component.html",
  styleUrls: ["./complaint-form.component.css"]
})
export class ComplaintFormComponent implements OnInit {

  model: ComplaintModel;


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
    private dataService: DataService,
  ) {
  }

  save() {

  }

  reset() {
    this.model = new ComplaintModel();
  }



  async ngOnInit() {


    this.reset();


  }



}

