import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PeopleFormComponent } from '../people-form/people-form.component';
import { PeopleTableComponent } from '../people-table/people-table.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';
import { DashboardSchema } from './dashboard.schema';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activatedRoute: ActivatedRoute;
  router: Router;
  routerSubscription: Subscription;
  tab: any;
  section: any;
  id: any;
  currentTab: any;
  schema: DashboardSchema;
  screen: string;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {

    this.router = _router;
    this.activatedRoute = _activatedRoute;
    this.schema = new DashboardSchema();

  }



  currentSchema = null;

  handleParams() {

    var params = this.activatedRoute.snapshot.params;

    if (!this.currentSchema || (this.currentSchema && this.currentSchema.name != params.section)) {
      this.currentSchema = _.findWhere(this.schema.current, { name: params.section || 'dashboard' });
    }

    if (!this.currentTab || (this.currentTab && this.currentTab.name != params.tab)) {
      this.currentTab = _.findWhere(this.currentSchema.tabs, { name: params.tab || 'default' });
    }



    console.log('handleParams called.');

  }



  ngOnInit() {

    this.screen = window.innerWidth < 900 ? 'mobile' : 'desktop';

    this.handleParams();

    this.routerSubscription = this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd)
        this.handleParams();

    });

  }

  components = [PeopleFormComponent, PeopleTableComponent];


}
