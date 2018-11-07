import { DashboardService } from "./../dashboard.service";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  NavigationCancel
} from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "underscore";

import { BusinessService } from "../business.service";
import { GmapsService } from "../gmaps.service";
import { DndDropEvent } from "ngx-drag-drop";
import { polyfill } from "mobile-drag-drop";
// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import { IdbService } from "../idb.service";

import * as moment from "moment-jalaali";
import { EventEmitter } from "@angular/core";
import { WidgetService } from "../widget.service";
import { CalendarMonthComponent } from "../calendar/calendar-month/calendar-month.component";
import { CalendarDayComponent } from "../calendar/calendar-day/calendar-day.component";
import { CalendarScheduleComponent } from "../calendar/calendar-schedule/calendar-schedule.component";
import { TicketFormComponent } from "../support/ticket-form/ticket-form.component";
import { TicketListComponent } from "../support/ticket-list/ticket-list.component";
import { InvoicesComponent } from "../support/invoices/invoices.component";
import { SmsServiceComponent } from "../support/sms-service/sms-service.component";
import { EmailServiceComponent } from "../support/email-service/email-service.component";
import { FaxServiceComponent } from "../support/fax-service/fax-service.component";
import { AccountProfileComponent } from "../account/account-profile/account-profile.component";
import { AccountPasswordComponent } from "../account/account-password/account-password.component";
import { AccountSessionsComponent } from "../account/account-sessions/account-sessions.component";
import { FormComponent } from "../base/form/form.component";
import { ReportComponent } from "../base/report/report.component";
import { TriggersComponent } from "../base/triggers/triggers.component";
import {
  DashboardGridInterface,
  DashboardContainerInterface,
  DashboardTabInterface,
  DashboardWidgetInterface,
  DashboardSectionInterface
} from "../schema";
import { WidgetCommandInterface } from "../models";
import { WsService } from "../ws.service";

polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

// workaround to make scroll prevent work in iOS Safari > 10
try {
  window.addEventListener("touchmove", function() {}, { passive: false });
} catch (e) {}

const dynamicComponents = {
  FormComponent,
  ReportComponent,
  TriggersComponent
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  openWidgets: any[] = [];
  screen: "mobile" | "desktop";
  gridSizeChange = new EventEmitter();
  dashboardSocket: WebSocket;
  private _grid: DashboardGridInterface;
  public get grid(): DashboardGridInterface {
    if (!this._grid) return { containers: [] };
    else return this._grid;
  }
  public set grid(v: DashboardGridInterface) {
    console.log("grid value change");
    this._grid = v;
  }

  dashboardReady = false;
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
  search: { text: String; mode: string } = { text: "", mode: "contacts" };

  dashboardDate = "";
  dashboardTime = "";

  dashboardDateTimeInterval;
  dashboardDateTimeFormats = [
    "dddd jD jMMMM jYYYY",
    "dddd D MMMM YYYY",
    "jYYYY/jMM/jDD",
    "YYYY/MM/DD"
  ];

  dashboardDateTimeTick() {
    //this.dashboardDateTimeFormats[0]
    var format = localStorage.getItem("dashboardDateTimeFormat");
    if (!format) format = this.dashboardDateTimeFormats[0];

    this.dashboardDate = moment().format(format);
    this.dashboardTime = moment().format("HH-mm-ss");

    this.changeRef.detectChanges();
  }

  toggleDashboardDateTimeFormat() {
    this.dashboardDateTimeFormats.push(this.dashboardDateTimeFormats.shift());
    localStorage.setItem(
      "dashboardDateTimeFormat",
      this.dashboardDateTimeFormats[0]
    );

    this.dashboardDateTimeTick();
  }

  explorerVisible: boolean = false;
  explorerAnimDone: boolean = true;

  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public businessService: BusinessService,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef,
    private widgetService: WidgetService,
    private wsService: WsService
  ) {
    moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });
  }

  clickOnStartWrapper(event: MouseEvent) {
    if ((event.target as HTMLElement).getAttribute("id") === "start")
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
    if (layoutNumber > this.grid.containers.length) {
      var toAdd = layoutNumber - this.grid.containers.length;

      for (let i = 1; i <= toAdd; i++)
        requestAnimationFrame(() => {
          this.addContainer();
        });
    }

    if (layoutNumber < this.grid.containers.length) {
      for (let i = this.grid.containers.length - 1; i >= layoutNumber; i--) {
        _.forEach(this.grid.containers[i].tabs, (tab: any) => {
          this.grid.containers[layoutNumber - 1].tabs.push(tab);
          this.grid.containers[i].tabs.splice(
            this.grid.containers[i].tabs.indexOf(tab),
            1
          );
        });
        this.grid.containers.splice(i, 1);
      }
    }

    this.setActiveTabs();
  }

  setActiveTabs() {
    this.grid.containers.forEach(cont => {
      if (cont.tabs.length > 0) {
        var activeTabsInContainer = _.where(cont.tabs, { active: true });
        if (
          activeTabsInContainer.length == 0 ||
          activeTabsInContainer.length > 1
        ) {
          cont.tabs.forEach(tab => {
            tab.active = false;
          });

          cont.tabs[0].active = true;
        }
      }
    });
  }

  onTabDragover(event: DragEvent, containerIndex: number) {
    console.log("onTabDragover");

    if (this.screen == "mobile") return;

    var targetPosition = (event.target as HTMLElement).parentElement.getBoundingClientRect();

    var handlerPosition = { top: event.clientY, left: event.clientX };

    // If handle is near left side of container its possible he needs another container

    if (handlerPosition.top > 100)
      if (
        handlerPosition.left - targetPosition.left < 200 &&
        handlerPosition.left - targetPosition.left > 0
      ) {
        var notEmptyContainersCount = _.filter(
          this.grid.containers,
          container => {
            return container.tabs && container.tabs.length > 0;
          }
        ).length;

        //if (this.grid.containers.length < 3)
        if (
          notEmptyContainersCount - containerIndex == 1 &&
          !this.grid.containers[containerIndex + 1]
        ) {
          this.addContainer();
        }

        var grid = document.querySelector(".grid-container");
        if (containerIndex > 1)
          grid.scroll({ left: grid.scrollLeft - 200, behavior: "smooth" });
      }
  }

  definedItemsOfArray(array) {
    return _.filter(array, (item: any) => {
      return item != undefined;
    });
  }

  onTabDrop(event: DndDropEvent | any, dropToContainerIndex) {
    console.log("onTabDrop");
    if (this.screen == "mobile") this.explorerMouseOut();

    var eventData: { containerIndex: number; tabIndex: number; tab: any } =
      event.data;

    if (eventData.tab)
      if (eventData.tab.widgets[0].id)
        if (
          JSON.stringify(this.grid.containers).indexOf(
            eventData.tab.widgets[0].id
          ) != -1
        )
          return;

    var toDrop =
      eventData.tab ||
      this.grid.containers[eventData.containerIndex].tabs[eventData.tabIndex];

    _.forEach(
      this.grid.containers[dropToContainerIndex].tabs,
      (tab: { active: boolean }) => {
        tab.active = false;
      }
    );

    if (eventData.containerIndex != dropToContainerIndex) {
      toDrop.active = true;
    }

    if (eventData.containerIndex != undefined)
      this.grid.containers[eventData.containerIndex].tabs.splice(
        eventData.tabIndex,
        1
      );

    this.grid.containers[dropToContainerIndex].tabs.push(toDrop);

    if (eventData.containerIndex != undefined)
      if (
        this.grid.containers[eventData.containerIndex].tabs.length == 1 ||
        _.where(this.grid.containers[eventData.containerIndex].tabs, {
          active: true
        }).length == 0
      )
        if (this.grid.containers[eventData.containerIndex].tabs[0])
          this.grid.containers[eventData.containerIndex].tabs[0].active = true;

    this.syncGrid();
  }

  getExplorerSections(sections: DashboardSectionInterface[]) {
    return _.filter(sections, (sec: DashboardSectionInterface) => {
      return sec.name != "dashboard";
    });
  }

  async handleParams() {
    const params = this.activatedRoute.snapshot.params;

    console.log(params);
    if (
      !this.dashboardService.currentSection ||
      (this.dashboardService.currentSection &&
        this.dashboardService.currentSection.name !== params.section)
    )
      this.dashboardService.currentSection = _.findWhere(
        this.dashboardService.schema.dashboard,
        { name: params.section || "dashboard" }
      );

    if (this.dashboardService.currentSection) {
      var tabsToAdd = _.clone(this.dashboardService.currentSection.tabs);

      this.grid = { containers: [{ tabs: tabsToAdd }] };
      this.grid.version = Date.now();
      if (this.grid.containers[0].tabs[0])
        this.grid.containers[0].tabs[0].active = true;

      if (this.dashboardService.screen == "desktop") {
        for (let i = 0; i < tabsToAdd.length - 1; i++) {
          this.addContainer();
        }
        for (let i = tabsToAdd.length - 1; i >= 1; i--) {
          this.onTabDrop(
            {
              data: {
                containerIndex: 0,
                tabIndex: i,
                tab: this.grid.containers[0].tabs[i]
              }
            },
            i
          );
        }
      }
    }

    this.syncGrid();
  }

  addContainer() {
    if (this.dashboardService.currentSection) {
      //JSON.parse(JSON.stringify(this.dashboardService.currentSection.tabs))
      this.grid.containers.push({ tabs: [] });
      // this.grid.containers[1].tabs[0].active = true;
    }
  }

  setActive(
    tab: DashboardTabInterface,
    container: DashboardContainerInterface
  ) {
    _.forEach(container.tabs, (t: any) => {
      t.active = false;
    });

    tab.active = true;
  }

  extendObj(obj1, obj2) {
    return _.extend({}, obj1, obj2);
  }

  // it will be passed to each dynamic component and grab the output from component @output() eventEmitter
  dashboardCommand(
    containerIndex: number,
    tabIndex: number,
    widgetIndex: number
  ) {
    return (options: WidgetCommandInterface) => {
      var tabToAdd: DashboardTabInterface = {
        title: options.title,
        active: true,
        icon: options.icon,
        widgets: [
          {
            component: options.component,
            inputs: { documentId: options.documentId }
          }
        ]
      };

      var existInGrid = _.chain(this.grid.containers)
        .map((c: DashboardContainerInterface) => {
          return c.tabs;
        })
        .flatten()
        .map((t: any) => {
          return t.widgets;
        })
        .flatten()
        .any(w => {
          return w && w.inputs && w.inputs.documentId == options.documentId;
        })
        .value();

      if (existInGrid) {
        console.log("widget already exist");
        return;
      }

      if (window.innerWidth > 860) {
        var addedToCurrentContainers = false;
        var containerModifiedId = 0;
        for (let i = 0; i < this.grid.containers.length; i++) {
          if (this.grid.containers[i])
            if (this.grid.containers[i].tabs.length == 0) {
              this.grid.containers[i].tabs.push(tabToAdd);
              this.setActive(tabToAdd, this.grid.containers[i]);
              containerModifiedId = i;
              addedToCurrentContainers = true;
              break;
            }
        }

        if (!addedToCurrentContainers) {
          this.grid.containers.push({ tabs: [tabToAdd] });
          containerModifiedId = this.grid.containers.length;
        }

        setTimeout(() => {
          var gridElem = document.querySelector(".grid-container");

          var navPassed = 0;
          var widthToRightOfGrid = 0;
          var tabContainers = document
            .querySelector(".grid-container")
            .querySelectorAll(".tabs-container") as any;
          tabContainers.forEach(tabContainer => {
            if (navPassed >= containerModifiedId) return;
            else {
              widthToRightOfGrid += tabContainer.getBoundingClientRect().width;
              navPassed++;
            }
          });

          gridElem.scroll({
            left: gridElem.scrollWidth - widthToRightOfGrid - 440,
            behavior: "smooth"
          });
        }, 500);
      } else {
        this.grid.containers[containerIndex].tabs.push(tabToAdd);
        this.setActive(tabToAdd, this.grid.containers[containerIndex]);
      }
    };
  }

  tabChange(containerIndex: number, tabIndex: number, widgetIndex: number) {
    return (newTab: DashboardTabInterface) => {
      this.grid.containers[containerIndex].tabs[tabIndex] = _.extend(
        this.grid.containers[containerIndex].tabs[tabIndex],
        newTab
      );
      this.changeRef.detectChanges();
    };
  }

  // widgetIdChange(widget: DashboardWidgetInterface) {
  //   return newId => {
  //     widget.id = newId;
  //   };
  // }

  async syncGrid() {
    this.grid.version = Date.now();

    console.log("syncGrid");
    if (
      !this.dashboardSocket ||
      (this.dashboardSocket &&
        this.dashboardSocket.readyState != WebSocket.OPEN)
    ) {
      await this.newDashboardSocket();
    }

    this.dashboardSocket.send(
      JSON.stringify({ command: "sync_grid", data: JSON.stringify(this.grid) })
    );
  }

  widgetChange(containerIndex: number, tabIndex: number, widgetIndex: number) {
    return (newWidget: DashboardWidgetInterface) => {
      newWidget.inputs = _.extend(
        this.grid.containers[containerIndex].tabs[tabIndex].widgets[widgetIndex]
          .inputs,
        newWidget.inputs
      );

      this.grid.containers[containerIndex].tabs[tabIndex].widgets[
        widgetIndex
      ] = _.extend(
        this.grid.containers[containerIndex].tabs[tabIndex].widgets[
          widgetIndex
        ],
        newWidget
      );

      this.syncGrid();
    };
  }

  getComponent(componentName) {
    return dynamicComponents[componentName];
  }

  getWidgets(tab) {
    if (tab.widgets) return tab.widgets;
    else return [];
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();

    if (this.dashboardDateTimeInterval)
      clearInterval(this.dashboardDateTimeInterval);
  }

  closeTab(containerIndex, tabIndex) {
    this.grid.containers[containerIndex].tabs.splice(tabIndex, 1);

    if (
      this.grid.containers[containerIndex].tabs.length == 1 ||
      _.where(this.grid.containers[containerIndex].tabs, {
        active: true
      }).length == 0
    )
      if (this.grid.containers[containerIndex].tabs[0])
        this.grid.containers[containerIndex].tabs[0].active = true;
  }

  async refreshOpenWidgets() {
    var stateDb = await this.idbService.userIDB("state");

    this.openWidgets = await Promise.all(
      _.map(await stateDb.keys(), key => {
        return stateDb.get(key);
      })
    );
  }

  async handleHeaderSwipe() {
    var headerElement = document.getElementById("header");

    headerElement.querySelector(".shortcuts").classList.remove("show");

    var swipeDownTimeout = null;

    var swipeRight = () => {
      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      if (document.querySelector("aside#explorer").classList.contains("hide")) {
        headerElement.querySelector(".shortcuts").classList.add("show");
      } else this.explorerMouseOut();
    };

    var swipeLeft = () => {
      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      if (
        headerElement.querySelector(".shortcuts").classList.contains("show")
      ) {
        headerElement.querySelector(".shortcuts").classList.remove("show");
      } else {
        this.explorerMouseIn();
      }
    };

    headerElement.ontouchstart = headerElement.onmousedown = (down_ev: any) => {
      var startPoint = down_ev.clientX || down_ev.touches[0].clientX;

      headerElement.classList.add("swipe");

      headerElement.ontouchmove = headerElement.onmousemove = (
        move_ev: any
      ) => {
        var currentPoint = move_ev.clientX || move_ev.touches[0].clientX;
        var lineLength = currentPoint - startPoint;
        if (lineLength < -80) swipeLeft();

        if (lineLength > 80) swipeRight();
      };
    };

    headerElement.ontouchend = headerElement.onmouseup = () => {
      headerElement.onmousemove = null;
      headerElement.ontouchmove = null;

      headerElement.classList.remove("swipe");
    };
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

      startPos = {
        x: start_ev.clientX || start_ev.touches[0].clientX,
        y: start_ev.clientY || start_ev.touches[0].clientY
      };
    };

    document.ontouchmove = document.onmousemove = (move_ev: any) => {
      if (!captureMove) return;

      document.querySelector("body").setAttribute("style", "overflow:hidden;");

      elem.classList.add("moving");

      var movePos = {
        x: move_ev.clientX || move_ev.touches[0].clientX,
        y: move_ev.clientY || move_ev.touches[0].clientY
      };

      var destPos = {
        x: elemPos.x - (startPos.x - movePos.x),
        y: elemPos.y - (startPos.y - movePos.y)
      };

      if (
        destPos.x < 5 ||
        destPos.x >
          window.innerWidth -
            (this.dashboardService.screen == "mobile" ? 37 : 69)
      )
        return;

      if (
        destPos.y < 5 ||
        destPos.y >
          window.innerHeight -
            (this.dashboardService.screen == "mobile" ? 37 : 69)
      )
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

    if (!gridElem) return;

    var gridRect = gridElem.getBoundingClientRect();

    var count = Math.round(gridRect.width / 420);

    if (count == 1 || count > this.grid.containers.length)
      this.setGridLayout(count);
  }

  handleFullNav() {
    setInterval(() => {
      _.forEach(document.querySelectorAll("ul.tabs-nav"), navTab => {
        var navTabId = navTab.getAttribute("id");
        var container = this.grid.containers[
          parseInt(navTabId.split("-").reverse()[0])
        ];
        if (!container) return;

        var isFull =
          navTab.getBoundingClientRect().width / container.tabs.length < 150;
        // var isFull = navTab.getBoundingClientRect().width <= _.reduceRight(navTab.querySelectorAll("li"), (memo, item: HTMLElement) => {
        //   return memo + item.getBoundingClientRect().width;
        // }, 0);

        // isFull = false;

        if (isFull) {
          if (this.fullNavTabs.indexOf(navTabId) == -1) {
            this.fullNavTabs.push(navTabId);
          }
        } else {
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
      if (
        Date.now() - lastCapture < 500 ||
        target.classList.contains("grid-container") ||
        target.classList.contains("tabs-container")
      ) {
        lastCapture = Date.now();
        if (ev.deltaY > 0) {
          grid.scroll({ left: grid.scrollLeft - 100, behavior: "instant" });
        } else {
          grid.scroll({ left: grid.scrollLeft + 100, behavior: "instant" });
        }
      }
    };

    grid.onmousedown = (down_ev: MouseEvent) => {
      var target = down_ev.target as HTMLElement;

      if (
        target.classList.contains("grid-container") ||
        target.classList.contains("tabs-container")
      ) {
        if (captureTimeout) clearTimeout(captureTimeout);

        capture = true;
        last = start = { x: down_ev.clientX, y: down_ev.clientY };
      }
    };

    grid.onmousemove = (move_ev: MouseEvent) => {
      if (capture) {
        grid.scroll({
          left: grid.scrollLeft - (move_ev.clientX - last.x),
          behavior: "instant"
        });
        last = { x: move_ev.clientX, y: move_ev.clientY };
      } else {
      }
    };

    grid.onmouseup = (up_ev: MouseEvent) => {
      capture = false;
      last = { x: 0, y: 0 };
    };
  }

  async newDashboardSocket() {
    this.dashboardSocket = await this.wsService.newSocket("/dashboard", true);

    this.dashboardSocket.onmessage = (ev: MessageEvent) => {
      var msg: { command: "change_grid"; data: any } = JSON.parse(ev.data);

      msg.data = JSON.parse(msg.data);

      if (
        msg.command == "change_grid" &&
        msg.data.version > this.grid.version
      ) {
        console.log("should chang grid");
        this.grid = msg.data;
        this.changeRef.markForCheck();
      }
      console.log(msg);
    };
  }

  async ngOnInit() {
    this.newDashboardSocket()
      .then(() => {})
      .catch(() => {});

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
    this.handleGridMouseDragScroll();

    this.dashboardReady = true;

    this.dashboardDateTimeInterval = setInterval(() => {
      this.dashboardDateTimeTick();
    }, 1000);

    document.onscroll = () => {
      if (document.scrollingElement.scrollTop > 30) {
        document.querySelector("aside#explorer").classList.add("docScrolled");
        document.querySelector(".grid-container").classList.add("docScrolled");
      } else {
        document
          .querySelector("aside#explorer")
          .classList.remove("docScrolled");
        document
          .querySelector(".grid-container")
          .classList.remove("docScrolled");
      }
    };

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.handleParams();

      if (event instanceof NavigationEnd || event instanceof NavigationCancel)
        document.getElementById("start").classList.remove("fadeIn");
    });
  }
}
