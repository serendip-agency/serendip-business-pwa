import { DashboardService } from "./../../dashboard.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { InsertMessage } from "../../messaging/InsertMessage";
import { MessagingService } from "../../messaging.service";
import { Subscription } from "rxjs";
import * as Moment from 'moment-jalaali'
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
    moment: typeof Moment;

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
            receivedTime: [this.moment().format('HH:mm'), Validators.required],
            receivedDate: [this.moment().format('jYYYY/jMM/jDD'), Validators.required],
            dueTime: ['16:00', Validators.required],
            dueDate: [this.moment().add(1, 'day').format('jYYYY/jMM/jDD'), Validators.required],
            doneTime: [this.moment().format('HH:mm'), Validators.required],
            doneDate: [this.moment().format('jYYYY/jMM/jDD'), Validators.required],
         
            isDone: [false]
        });

        this.serviceForm.valueChanges.subscribe(data => { });

        if (params.id) {
            var model = await this.dataService.details('service', params.id);
            console.log(model);
            this.serviceForm.patchValue(model);
           // this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
        }

    }
    handleParams(): any {
        const params = this.activatedRoute.snapshot.params;
        if (params.id) {
        //    this.dashboardService.setCurrentTab({ title: "ویرایش " + params.id });
        }
    }

}
