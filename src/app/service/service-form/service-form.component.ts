import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";
import * as Moment from 'moment-jalaali'
import { ServiceModel } from "serendip-crm-model";
@Component({
    selector: "app-service-form",
    templateUrl: "./service-form.component.html",
    styleUrls: ["./service-form.component.css"]
})
export class ServiceFormComponent implements OnInit {


    routerSubscription: Subscription;
    moment: typeof Moment;
    model: ServiceModel;

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
    ) {
        this.moment = Moment;

    }

    save() {

    }

    reset() {
        this.model = new ServiceModel();
    }

    async ngOnInit() {
        this.reset();
    }


}
