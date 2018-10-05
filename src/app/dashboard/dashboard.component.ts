import { DashboardService } from "./../dashboard.service";
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, NavigationCancel } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "underscore";

import { PeopleTableComponent } from "../people/people-table/people-table.component";
import { PeopleSearchComponent } from "../people/people-search/people-search.component";
import { PeopleFormComponent } from "../people/people-form/people-form.component";
import { PeopleDeleteComponent } from "../people/people-delete/people-delete.component";
import { PeopleListComponent } from "../people/people-list/people-list.component";
import { CompanyDeleteComponent } from "../company/company-delete/company-delete.component";
import { CompanyListComponent } from "../company/company-list/company-list.component";
import { CompanyTableComponent } from "../company/company-table/company-table.component";
import { CompanyFormComponent } from "../company/company-form/company-form.component";
import { ComplaintDeleteComponent } from "../complaint/complaint-delete/complaint-delete.component";
import { ComplaintFormComponent } from "../complaint/complaint-form/complaint-form.component";
import { ComplaintTableComponent } from "../complaint/complaint-table/complaint-table.component";
import { ComplaintListComponent } from "../complaint/complaint-list/complaint-list.component";
import { ServiceDeleteComponent } from "../service/service-delete/service-delete.component";
import { ServiceTableComponent } from "../service/service-table/service-table.component";
import { ServiceListComponent } from "../service/service-list/service-list.component";
import { ServiceFormComponent } from "../service/service-form/service-form.component";
import { ProductDeleteComponent } from "../product/product-delete/product-delete.component";
import { ProductListComponent } from "../product/product-list/product-list.component";
import { ProductFormComponent } from "../product/product-form/product-form.component";
import { ProductTableComponent } from "../product/product-table/product-table.component";
import { CompanySearchComponent } from "../company/company-search/company-search.component";
import { ComplaintSearchComponent } from "../complaint/complaint-search/complaint-search.component";
import { ProductSearchComponent } from "../product/product-search/product-search.component";
import { InteractionFormComponent } from "../interaction/interaction-form/interaction-form.component";
import { InteractionTableComponent } from "../interaction/interaction-table/interaction-table.component";
import { InteractionListComponent } from "../interaction/interaction-list/interaction-list.component";
import { InteractionDeleteComponent } from "../interaction/interaction-delete/interaction-delete.component";
import { UserProfileComponent } from "../settings/user-profile/user-profile.component";
import { CrmService } from "../crm.service";
import { GmapsService } from "../gmaps.service";
import { DndDropEvent } from "ngx-drag-drop";
import { polyfill } from 'mobile-drag-drop';
// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import { IdbService } from "../idb.service";

import * as moment from 'moment-jalaali';
import { EventEmitter } from "@angular/core";

polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

// workaround to make scroll prevent work in iOS Safari > 10
try {
  window.addEventListener("touchmove", function () { }, { passive: false });
}
catch (e) { }

const dynamicComponents = {
  PeopleFormComponent,
  PeopleTableComponent,
  PeopleSearchComponent,
  PeopleDeleteComponent,
  PeopleListComponent,
  CompanyDeleteComponent,
  CompanyListComponent,
  CompanyTableComponent,
  CompanyFormComponent,
  ComplaintDeleteComponent,
  ComplaintFormComponent,
  ComplaintTableComponent,
  ComplaintListComponent,
  ServiceDeleteComponent,
  ServiceTableComponent,
  ServiceListComponent,
  ServiceFormComponent,
  ProductDeleteComponent,
  ProductListComponent,
  ProductFormComponent,
  ProductTableComponent,
  CompanySearchComponent,
  ComplaintSearchComponent,
  ProductSearchComponent,
  InteractionFormComponent,
  InteractionTableComponent,
  InteractionListComponent,
  InteractionDeleteComponent,
  UserProfileComponent
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  openWidgets: any[] = [];


  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  routerSubscription: Subscription;
  search: { text: String, mode: string } = { text: '', mode: 'contacts' };


  dashboardDate = "";
  dashboardTime = "";

  refreshOpenWidgetEmitter: EventEmitter<void> = new EventEmitter<void>();


  dashboardDateTimeInterval;
  dashboardDateTimeFormats = [
    "dddd jD jMMMM jYYYY",
    "dddd D MMMM YYYY",
    "jYYYY/jMM/jDD",
    "YYYY/MM/DD"];


  dashboardDateTimeTick() {

    //this.dashboardDateTimeFormats[0]
    var format = localStorage.getItem("dashboardDateTimeFormat");
    if (!format)
      format = this.dashboardDateTimeFormats[0];

    this.dashboardDate = moment().format(format);
    this.dashboardTime = moment().format("HH-mm-ss")

    this.changeRef.detectChanges();
  }


  toggleDashboardDateTimeFormat() {

    this.dashboardDateTimeFormats.push(this.dashboardDateTimeFormats.shift());
    localStorage.setItem("dashboardDateTimeFormat", this.dashboardDateTimeFormats[0]);

    this.dashboardDateTimeTick();

  }


  explorerVisible: boolean = false;
  explorerAnimDone: boolean = true;

  gridLayout = {
    containers: []
  };

  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public crmService: CrmService,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef
  ) {

    moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });


  }


  clickOnStartWrapper(event: MouseEvent) {
    if ((event.target as HTMLElement).getAttribute('id') === 'start')
      document.getElementById("start").classList.remove("fadeIn");
  }

  getExplorerTabs(tabs: any) {

    return _.filter(tabs, (tab: any) => {
      return tab.title != null && tab.name != "default";
    });

  }

  explorerAnimInTimeout = null;
  explorerAnimOutTimeout = null;
  explorerMouseIn() {
    this.explorerVisible = true;
    this.explorerAnimDone = false;

    clearTimeout(this.explorerAnimInTimeout);

    this.explorerAnimInTimeout = setTimeout(() => {
      this.explorerAnimDone = true;
    }, 300);
  }


  explorerMouseOut() {
    this.explorerVisible = false;
    this.explorerAnimDone = false;

    clearTimeout(this.explorerAnimOutTimeout);

    this.explorerAnimOutTimeout = setTimeout(() => {
      this.explorerAnimDone = true;
    }, 500);
  }



  setGridLayout(layoutNumber) {



    if (layoutNumber > this.gridLayout.containers.length)
      for (let i = 1; i <= layoutNumber - this.gridLayout.containers.length; i++)
        setTimeout(() => {
          this.addContainer();
        }, i * 10);


    if (layoutNumber < this.gridLayout.containers.length) {

      for (let i = this.gridLayout.containers.length - 1; i >= layoutNumber; i--) {


        _.forEach(this.gridLayout.containers[i].tabs, (tab: any) => {

          this.gridLayout.containers[layoutNumber - 1].tabs.push(tab);
          this.gridLayout.containers[i].tabs.splice(this.gridLayout.containers[i].tabs.indexOf(tab), 1);

        });

        this.gridLayout.containers.splice(i, 1);



      }


    }



  }

  onTabDragover(event: DragEvent, containerIndex: number) {


    if (this.dashboardService.screen == "mobile")
      return;
    //console.log("dragover",  event,containerIndex);
    var targetPosition = (event.target as HTMLElement).parentElement.getBoundingClientRect();

    var handlerPosition = { top: event.clientY, left: event.clientX };



    // If handle is near left side of container its possible he needs another container
    if (handlerPosition.top > 100)
      if (handlerPosition.left - targetPosition.left < 200 && handlerPosition.left - targetPosition.left > 0) {
        var notEmptyContainersCount = _.filter(this.gridLayout.containers, (container) => {
          return container.tabs && container.tabs.length > 0;
        }).length;

        if (this.gridLayout.containers.length < 3)
          if (notEmptyContainersCount - containerIndex == 1 && !this.gridLayout.containers[containerIndex + 1])
            this.addContainer();

      }




  }


  onTabDrop(event: DndDropEvent, dropToContainerIndex) {


    if (this.dashboardService.screen == "mobile")
      this.explorerMouseOut();

    var eventData: { containerIndex: number, tabIndex: number, tab: any } = event.data;
    console.log(eventData);

    if (eventData.tab)
      if (eventData.tab.widgets[0].id)
        if (JSON.stringify(this.gridLayout.containers).indexOf(eventData.tab.widgets[0].id) != -1)
          return;


    var toDrop = eventData.tab || this.gridLayout.containers[eventData.containerIndex].tabs[eventData.tabIndex];

    _.forEach(this.gridLayout.containers[dropToContainerIndex].tabs, (tab: { active: boolean }) => {
      tab.active = false;
    });

    if (eventData.containerIndex != dropToContainerIndex) {
      toDrop.active = true;
    }

    if (eventData.containerIndex != undefined)
      this.gridLayout.containers[eventData.containerIndex].tabs.splice(eventData.tabIndex, 1);


    this.gridLayout.containers[dropToContainerIndex].tabs.push(toDrop);


    if (eventData.containerIndex != undefined)
      if (this.gridLayout.containers[eventData.containerIndex].tabs.length == 1 || _.where(this.gridLayout.containers[eventData.containerIndex].tabs, { active: true }).length == 0)
        this.gridLayout.containers[eventData.containerIndex].tabs[0].active = true;

  }


  getExplorerSections(sections: any) {

    return _.filter(sections, (sec: any) => {
      return sec.name != "dashboard";
    });

  }

  handleParams() {

    const params = this.activatedRoute.snapshot.params;

    if (!this.dashboardService.currentSection || (this.dashboardService.currentSection && this.dashboardService.currentSection.name !== params.section))
      this.dashboardService.currentSection = _.findWhere(this.dashboardService.schema, { name: params.section });


    if (this.dashboardService.currentSection) {

      this.gridLayout.containers = [];

      this.gridLayout.containers.push({ tabs: _.clone(this.dashboardService.currentSection.tabs) });

      this.gridLayout.containers[0].tabs[0].active = true;


      if (this.dashboardService.screen == "desktop")
        this.addContainer();

    }

    console.log("handleParams called.");

  }

  addContainer() {

    if (this.dashboardService.currentSection) {
      //JSON.parse(JSON.stringify(this.dashboardService.currentSection.tabs))
      this.gridLayout.containers.push({ tabs: [] });
      // this.gridLayout.containers[1].tabs[0].active = true;
    }

  }

  setTabActive(tab, container) {

    _.forEach(container.tabs, (t: any) => {
      t.active = false;
    });

    tab.active = true;

  }

  widgetIdChange(widget) {


    return (newId) => {

      console.log(newId);
      widget.id = newId;
    };


  }

  widgetDataChange() {

    var emitter = this.refreshOpenWidgetEmitter;
    return (data) => {

      emitter.emit();

    };

  }

  getComponent(componentName) {



    return dynamicComponents[componentName];


  }

  getTabWidgets(tab) {

    if (tab.widgets)
      return tab.widgets
    else
      return [];

  }
  ngOnDestroy(): void {
    if (this.routerSubscription)
      this.routerSubscription.unsubscribe();

    if (this.dashboardDateTimeInterval)
      clearInterval(this.dashboardDateTimeInterval);
  }

  closeTab(containerIndex, tabIndex) {


    if (this.gridLayout.containers[containerIndex].tabs[tabIndex].widgets[0].id) {
      this.closeTabWidthWidgetId(this.gridLayout.containers[containerIndex].tabs[tabIndex].widgets[0].id);
    } else {
      this.gridLayout.containers[containerIndex].tabs.splice(tabIndex, 1);

      if (this.gridLayout.containers[containerIndex].tabs.length == 1 || _.where(this.gridLayout.containers[containerIndex].tabs, { active: true }).length == 0)
        if (this.gridLayout.containers[containerIndex].tabs[0])
          this.gridLayout.containers[containerIndex].tabs[0].active = true;
    }


  }

  closeTabWidthWidgetId(id) {

    this.gridLayout.containers.forEach(cont => {

      cont.tabs.forEach(tab => {

        if (tab.widgets[0])
          if (tab.widgets[0].id)
            if (tab.widgets[0].id == id) {

              cont.tabs.splice(cont.tabs.indexOf(tab), 1);
              if (cont.tabs.length > 0)
                cont.tabs[0].active = true;

            }

      });



    });

  }

  async refreshOpenWidgets() {

    var stateDb = await this.idbService.userIDB("state");

    this.openWidgets = await Promise.all(_.map(await stateDb.keys(), (key) => {

      return stateDb.get(key);

    }));

  }

  async deleteWidgetState(id) {
    var stateDb = await this.idbService.userIDB("state");
    await stateDb.delete(id);
    this.refreshOpenWidgets();
    this.closeTabWidthWidgetId(id);


  }


  async handleHeaderSwipe() {

    var headerElement = document.getElementById("header");
    headerElement.querySelector(".inner").setAttribute("style", `left:0;`);
    headerElement.querySelector(".shortcuts").setAttribute("style", `left:-100%;`);

    var swipeDownTimeout = null;

    var swipeRight = () => {
      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      console.log('header swipe right');

      if (document.querySelector("aside#explorer").classList.contains("hide")) {

        headerElement.querySelector(".inner").setAttribute("style", `left:100%;`);
        headerElement.querySelector(".shortcuts").setAttribute("style", `left:0;`);
      } else
        this.explorerMouseOut();

      if (swipeDownTimeout)
        clearTimeout(swipeDownTimeout);
      swipeDownTimeout = setTimeout(() => {
        swipeLeft();
      }, 5000);
    }

    var swipeLeft = () => {

      console.log('header swipe left');

      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      if (headerElement.querySelector(".inner").getAttribute("style") != `left:0;`) {
        headerElement.querySelector(".inner").setAttribute("style", `left:0;`);
        headerElement.querySelector(".shortcuts").setAttribute("style", `left:-100%;`);

      } else {
        this.explorerMouseIn();
      }


    };

    headerElement.ontouchstart = headerElement.onmousedown = (down_ev: any) => {

      var startPoint = down_ev.clientX || down_ev.touches[0].clientX;

      headerElement.classList.add("swipe");


      headerElement.ontouchmove = headerElement.onmousemove = (move_ev: any) => {
        var currentPoint = move_ev.clientX || move_ev.touches[0].clientX;
        var lineLength = currentPoint - startPoint;
        if (lineLength < -100)
          swipeLeft();


        if (lineLength > 100)
          swipeRight();
      }

    }

    headerElement.ontouchend = headerElement.onmouseup = () => {

      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      headerElement.classList.remove("swipe");

    }


  }


  async handleStartButtonMove() {

    var elem = document.getElementById("start-button");

    var captureMove = false;
    var moved = false;
    var elemPos = { x: elem.offsetLeft, y: elem.offsetTop };
    var startPos = { x: 0, y: 0 };

    elem.ontouchstart = elem.onmousedown = (start_ev: any) => {

      elemPos = { x: elem.offsetLeft, y: elem.offsetTop };
      captureMove = true;
      moved = false;

      startPos = { x: start_ev.clientX || start_ev.touches[0].clientX, y: start_ev.clientY || start_ev.touches[0].clientY };

    };

    document.ontouchmove = document.onmousemove = (move_ev: any) => {


      if (!captureMove)
        return;


      document.querySelector("body").setAttribute("style", "overflow:hidden;");

      elem.classList.add("moving");

      var movePos = { x: move_ev.clientX || move_ev.touches[0].clientX, y: move_ev.clientY || move_ev.touches[0].clientY };

      var destPos = {
        x: elemPos.x - (startPos.x - movePos.x),
        y: elemPos.y - (startPos.y - movePos.y),
      };

      if (destPos.x < 5 || destPos.x > window.innerWidth - (this.dashboardService.screen == "mobile" ? 37 : 69))
        return;

      if (destPos.y < 5 || destPos.y > window.innerHeight - (this.dashboardService.screen == "mobile" ? 37 : 69))
        return;


      // console.log(move_ev);

      // elem.classList.add("move");
      elem.setAttribute("style", `top:${destPos.y}px;left:${destPos.x}px;`);
      moved = true;
    };
    document.ontouchend = document.onmouseup = (ev: any) => {
      if (captureMove) {
        captureMove = false;
        elem.classList.remove("moving");
        document.querySelector("body").removeAttribute("style");

        if (ev instanceof MouseEvent)
          if (!moved) document.getElementById("start").classList.toggle("fadeIn");

      }
    };



  }

  async ngOnInit() {


    await this.dashboardService.setDefaultSchema();


    this.handleHeaderSwipe();
    this.handleStartButtonMove();
    this.dashboardDateTimeTick();

    this.dashboardDateTimeInterval = setInterval(() => {
      this.dashboardDateTimeTick();
    }, 1000);


    document.onscroll = () => {

      if (document.scrollingElement.scrollTop > 30) {

        document.querySelector("aside#explorer").classList.add("docScrolled");
        document.querySelector(".grid-container").classList.add("docScrolled");

      } else {
        document.querySelector("aside#explorer").classList.remove("docScrolled");
        document.querySelector(".grid-container").classList.remove("docScrolled");
      }
    };

    if (this.dashboardService.screen == "desktop")
      this.explorerMouseIn();


    this.refreshOpenWidgets();
    this.refreshOpenWidgetEmitter.subscribe(() => {
      this.refreshOpenWidgets();
    });
    this.handleParams();

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
        this.handleParams();

      if (event instanceof NavigationEnd || event instanceof NavigationCancel)
        document.getElementById("start").classList.remove("fadeIn");

    });
  }
}
