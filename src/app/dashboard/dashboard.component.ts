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
import { CrmService } from "../crm.service";
import { GmapsService } from "../gmaps.service";
import { DndDropEvent } from "ngx-drag-drop";
import { polyfill } from 'mobile-drag-drop';
// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import { IdbService } from "../idb.service";

import * as moment from 'moment-jalaali';
import { EventEmitter } from "@angular/core";
import { UserActivityBySectionComponent } from "../charts/user-activity-by-section/user-activity-by-section.component";
import { OutcomeByCampaignComponent } from "../charts/outcome-by-campaign/outcome-by-campaign.component";
import { gridInterface, tabInterface, containerInterface, widgetInterface, widgetCommandInterface } from "../models";
import { WidgetService } from "../widget.service";
import { CalendarMonthComponent } from "../calendar/calendar-month/calendar-month.component";
import { CalendarDayComponent } from "../calendar/calendar-day/calendar-day.component";
import { CalendarScheduleComponent } from "../calendar/calendar-schedule/calendar-schedule.component";
import { SaleFormComponent } from "../sale/sale-form/sale-form.component";
import { SaleListComponent } from "../sale/sale-list/sale-list.component";
import { CampaignFormComponent } from "../campaign/campaign-form/campaign-form.component";
import { SaleTableComponent } from "../sale/sale-table/sale-table.component";
import { CampaignListComponent } from "../campaign/campaign-list/campaign-list.component";
import { CampaignTableComponent } from "../campaign/campaign-table/campaign-table.component";
import { TicketFormComponent } from "../support/ticket-form/ticket-form.component";
import { TicketListComponent } from "../support/ticket-list/ticket-list.component";
import { InvoicesComponent } from "../support/invoices/invoices.component";
import { SmsServiceComponent } from "../support/sms-service/sms-service.component";
import { EmailServiceComponent } from "../support/email-service/email-service.component";
import { FaxServiceComponent } from "../support/fax-service/fax-service.component";
import { AccountProfileComponent } from "../account/account-profile/account-profile.component";
import { AccountPasswordComponent } from "../account/account-password/account-password.component";
import { AccountSessionsComponent } from "../account/account-sessions/account-sessions.component";
import { ServiceTypesComponent } from "../settings/service-types/service-types.component";
import { PiplineLeadComponent } from "../pipline/pipline-lead/pipline-lead.component";
import { PiplineDealComponent } from "../pipline/pipline-deal/pipline-deal.component";
import { PiplineSaleComponent } from "../pipline/pipline-sale/pipline-sale.component";
import { ProductCategoriesComponent } from "../settings/product-categories/product-categories.component";

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
  UserActivityBySectionComponent,
  OutcomeByCampaignComponent,
  CalendarMonthComponent,
  CalendarDayComponent,
  CalendarScheduleComponent,
  SaleFormComponent,
  SaleListComponent,
  SaleTableComponent,
  CampaignFormComponent,
  CampaignListComponent,
  CampaignTableComponent,
  TicketFormComponent,
  TicketListComponent,
  AccountProfileComponent,
  AccountPasswordComponent,
  AccountSessionsComponent,
  InvoicesComponent,
  SmsServiceComponent,
  EmailServiceComponent,
  FaxServiceComponent,
  ServiceTypesComponent,
  PiplineLeadComponent,
  PiplineDealComponent,
  PiplineSaleComponent,
  ProductCategoriesComponent
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  openWidgets: any[] = [];
  screen: 'mobile' | 'desktop';


  gridSizeChange = new EventEmitter();


  showCalendar = false;

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

  gridLayout: gridInterface = {
    containers: []
  };

  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public crmService: CrmService,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef,
    private widgetService: WidgetService
  ) {

    moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });


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

    this.gridSizeChange.emit();
    clearTimeout(this.explorerAnimInTimeout);

    this.explorerAnimInTimeout = setTimeout(() => {
      this.explorerAnimDone = true;
      this.gridSizeChange.emit();

    }, 300);
  }


  explorerMouseOut() {
    this.explorerVisible = false;
    this.explorerAnimDone = false;
    this.gridSizeChange.emit();

    clearTimeout(this.explorerAnimOutTimeout);

    this.explorerAnimOutTimeout = setTimeout(() => {
      this.explorerAnimDone = true;
      this.gridSizeChange.emit();

    }, 500);
  }



  setGridLayout(layoutNumber) {

    if (layoutNumber > this.gridLayout.containers.length) {
      var toAdd = layoutNumber - this.gridLayout.containers.length;

      for (let i = 1; i <= toAdd; i++)
        requestAnimationFrame(() => {
          this.addContainer();
        });
    }

    if (layoutNumber < this.gridLayout.containers.length) {
      for (let i = this.gridLayout.containers.length - 1; i >= layoutNumber; i--) {
        _.forEach(this.gridLayout.containers[i].tabs, (tab: any) => {

          this.gridLayout.containers[layoutNumber - 1].tabs.push(tab);
          this.gridLayout.containers[i].tabs.splice(this.gridLayout.containers[i].tabs.indexOf(tab), 1);

        });
        this.gridLayout.containers.splice(i, 1);
      }
    }

    this.setActiveTabs();

  }


  setActiveTabs() {

    this.gridLayout.containers.forEach((cont) => {
      if (cont.tabs.length > 0) {
        var activeTabsInContainer = _.where(cont.tabs, { active: true });
        if (activeTabsInContainer.length == 0 || activeTabsInContainer.length > 1) {

          cont.tabs.forEach((tab) => { tab.active = false; });

          cont.tabs[0].active = true;

        }

      }
    });

  }

  onTabDragover(event: DragEvent, containerIndex: number) {


    if (this.screen == "mobile")
      return;

    var targetPosition = (event.target as HTMLElement).parentElement.getBoundingClientRect();

    var handlerPosition = { top: event.clientY, left: event.clientX };



    // If handle is near left side of container its possible he needs another container

    if (handlerPosition.top > 100)
      if (handlerPosition.left - targetPosition.left < 200 && handlerPosition.left - targetPosition.left > 0) {
        var notEmptyContainersCount = _.filter(this.gridLayout.containers, (container) => {
          return container.tabs && container.tabs.length > 0;
        }).length;

        //if (this.gridLayout.containers.length < 3)
        if (notEmptyContainersCount - containerIndex == 1 && !this.gridLayout.containers[containerIndex + 1]) {

          this.addContainer();


        }

        var grid = document.querySelector(".grid-container");
        if (containerIndex > 1)
          grid.scroll({ left: grid.scrollLeft - 200, behavior: 'smooth' });



      }




  }

  definedItemsOfArray(array) {
    return _.filter(array, (item: any) => {
      return item != undefined;
    });
  }

  onTabDrop(event: DndDropEvent | any, dropToContainerIndex) {


    if (this.screen == "mobile")
      this.explorerMouseOut();

    var eventData: { containerIndex: number, tabIndex: number, tab: any } = event.data;


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
        if (this.gridLayout.containers[eventData.containerIndex].tabs[0])
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
      this.dashboardService.currentSection = _.findWhere(this.dashboardService.schema, { name: params.section || "dashboard" });


    if (this.dashboardService.currentSection) {

      this.gridLayout.containers = [];

      var tabsToAdd = _.clone(this.dashboardService.currentSection.tabs);

      this.gridLayout.containers.push({ tabs: tabsToAdd });


      if (this.gridLayout.containers[0].tabs[0])
        this.gridLayout.containers[0].tabs[0].active = true;


      if (this.dashboardService.screen == "desktop") {


        for (let i = 0; i < tabsToAdd.length - 1; i++) {
          this.addContainer();
        }
        for (let i = tabsToAdd.length - 1; i >= 1; i--) {

          this.onTabDrop({ data: { containerIndex: 0, tabIndex: i, tab: this.gridLayout.containers[0].tabs[i] } }, i)
        }

      }

    }


  }

  addContainer() {

    if (this.dashboardService.currentSection) {
      //JSON.parse(JSON.stringify(this.dashboardService.currentSection.tabs))
      this.gridLayout.containers.push({ tabs: [] });
      // this.gridLayout.containers[1].tabs[0].active = true;
    }

  }

  setTabActive(tab: tabInterface, container: containerInterface) {

    _.forEach(container.tabs, (t: any) => {
      t.active = false;
    });

    tab.active = true;

  }

  extendObj(obj1, obj2) {
    return _.extend({}, obj1, obj2);
  }

  widgetCommand(widget: widgetInterface, tab: tabInterface, container: containerInterface) {

    return (options: widgetCommandInterface) => {

      var containerIndex = this.gridLayout.containers.indexOf(container);

      var tabToAdd: tabInterface = {
        title: options.title,
        active: true,
        icon: options.icon,
        widgets: [
          {
            component: options.component, inputs: { documentId: options.documentId }

          }]
      };

      var existInGrid = _.chain(this.gridLayout.containers)
        .map((c: containerInterface) => { return c.tabs })
        .flatten()
        .map((t: any) => { return t.widgets })
        .flatten()
        .any((w) => {
          return w && w.inputs && w.inputs.documentId == options.documentId;
        })
        .value();


      if (existInGrid) {


        console.log('widget already exist');
        return;
      }

      if (window.innerWidth > 860) {


        var addedToCurrentContainers = false;
        var containerModifiedId = 0;
        for (let i = 0; i < this.gridLayout.containers.length; i++) {
          if (this.gridLayout.containers[i])
            if (this.gridLayout.containers[i].tabs.length == 0) {
              this.gridLayout.containers[i].tabs.push(tabToAdd);
              this.setTabActive(tabToAdd, this.gridLayout.containers[i]);
              containerModifiedId = i;
              addedToCurrentContainers = true;
              break;
            }
        }

        if (!addedToCurrentContainers) {
          this.gridLayout.containers.push({ tabs: [tabToAdd] });
          containerModifiedId = this.gridLayout.containers.length;
        }




        setTimeout(() => {
          var gridElem = document.querySelector('.grid-container');

          var navPassed = 0;
          var widthToRightOfGrid = 0;
          var tabContainers = document.querySelector('.grid-container').querySelectorAll(".tabs-container") as any;
          tabContainers.forEach(tabContainer => {

            if (navPassed >= containerModifiedId)
              return;
            else {
              widthToRightOfGrid += tabContainer.getBoundingClientRect().width;
              navPassed++;
            }

          });

          gridElem.scroll({ left: gridElem.scrollWidth - widthToRightOfGrid - 440, behavior: 'smooth' });
        }, 500);


      } else {
        this.gridLayout.containers[containerIndex].tabs.push(tabToAdd);
        this.setTabActive(tabToAdd, container);

      }



    };

  }

  widgetTabChange(containerIndex: number, tabIndex: number) {

    return (newTab: tabInterface) => {


      this.gridLayout.containers[containerIndex].tabs[tabIndex] =
        _.extend(this.gridLayout.containers[containerIndex].tabs[tabIndex], newTab);;
      this.changeRef.detectChanges();


    };

  }

  widgetIdChange(widget: widgetInterface) {


    return (newId) => {

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

    headerElement.querySelector(".shortcuts").classList.remove('show');

    var swipeDownTimeout = null;

    var swipeRight = () => {
      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;




      if (document.querySelector("aside#explorer").classList.contains("hide")) {
        headerElement.querySelector(".shortcuts").classList.add("show");
      } else
        this.explorerMouseOut();

    }

    var swipeLeft = () => {




      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      if (headerElement.querySelector(".shortcuts").classList.contains("show")) {

        headerElement.querySelector(".shortcuts").classList.remove("show");

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
        if (lineLength < -80)
          swipeLeft();


        if (lineLength > 80)
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



      elem.setAttribute("style", `top:${destPos.y}px;left:${destPos.x}px;`);
      moved = true;
    };
    document.ontouchend = document.onmouseup = (ev: any) => {
      if (captureMove) {
        captureMove = false;
        elem.classList.remove("moving");
        document.querySelector("body").removeAttribute("style");

        if (ev instanceof MouseEvent)
          if (!moved) {
            document.getElementById("start").classList.toggle("fadeIn");
            document.querySelector("body").classList.toggle("hideScroll");
          }
      }
    };



  }

  fullNavTabs = [];

  isNavTabFull(navTabId) {

    return this.fullNavTabs.indexOf(navTabId) != -1;

  }

  adjustLayout() {


    var gridElem = document.querySelector(".grid-container");

    if (!gridElem)
      return;

    var gridRect = gridElem.getBoundingClientRect();



    var count = Math.round(gridRect.width / 420);

    if (count == 1 || count > this.gridLayout.containers.length)
      this.setGridLayout(count);


  }

  handleFullNav() {

    setInterval(() => {

      _.forEach(document.querySelectorAll("ul.tabs-nav"), navTab => {
        var navTabId = navTab.getAttribute("id");
        var container = this.gridLayout.containers[parseInt(navTabId.split('-').reverse()[0])];
        if (!container)
          return;

        var isFull = navTab.getBoundingClientRect().width / container.tabs.length < 150;
        // var isFull = navTab.getBoundingClientRect().width <= _.reduceRight(navTab.querySelectorAll("li"), (memo, item: HTMLElement) => {
        //   return memo + item.getBoundingClientRect().width;
        // }, 0);

        // isFull = false;

        if (isFull) {
          if (this.fullNavTabs.indexOf(navTabId) == -1) {
            this.fullNavTabs.push(navTabId);
          }
        }
        else {
          if (this.fullNavTabs.indexOf(navTabId) != -1)
            this.fullNavTabs.splice(this.fullNavTabs.indexOf(navTabId), 1);
        }

      });

    }, 1000);

  }


  handleGridMouseDragScroll() {

    var start = { x: 0, y: 0 };
    var capture = false;
    var lastCapture = 0;
    var grid = document.querySelector(".grid-container") as any;
    var last = { x: 0, y: 0 };
    var captureTimeout;


    grid.onmousewheel = (ev: MouseWheelEvent) => {


      var target = ev.target as HTMLElement;
      if (Date.now() - lastCapture < 500 || target.classList.contains('grid-container') || target.classList.contains('tabs-container')) {
        lastCapture = Date.now();
        if (ev.deltaY > 0) {
          grid.scroll({ left: grid.scrollLeft - 100, behavior: 'instant' });
        } else {
          grid.scroll({ left: grid.scrollLeft + 100, behavior: 'instant' });
        }
      }
    };


    grid.onmousedown = (down_ev: MouseEvent) => {

      var target = down_ev.target as HTMLElement;

      if (target.classList.contains('grid-container') || target.classList.contains('tabs-container')) {

        if (captureTimeout)
          clearTimeout(captureTimeout);



        capture = true;
        last = start = { x: down_ev.clientX, y: down_ev.clientY };

      }
    };

    grid.onmousemove = (move_ev: MouseEvent) => {


      if (capture) {

        grid.scroll({ left: grid.scrollLeft - (move_ev.clientX - last.x), behavior: 'instant' });
        last = { x: move_ev.clientX, y: move_ev.clientY };


      } else {



      }

    };

    grid.onmouseup = (up_ev: MouseEvent) => {

      capture = false;
      last = { x: 0, y: 0 };
    };

  }

  async ngOnInit() {

    this.handleGridMouseDragScroll();
    await this.dashboardService.setDefaultSchema();
    await this.handleParams();

    this.gridSizeChange.subscribe(() => {

      this.adjustLayout();

    });

    window.onresize = () => {

      this.gridSizeChange.emit();

    };

    this.gridSizeChange.emit();

    this.handleFullNav();
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

    this.refreshOpenWidgets();
    this.refreshOpenWidgetEmitter.subscribe(() => {
      this.refreshOpenWidgets();
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
        this.handleParams();

      if (event instanceof NavigationEnd || event instanceof NavigationCancel)
        document.getElementById("start").classList.remove("fadeIn");

    });

  }
}
