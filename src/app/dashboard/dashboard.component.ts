import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  Router
} from "@angular/router";
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import * as moment from "moment-jalaali";
import { DndDropEvent } from "ngx-drag-drop";
import { Subscription } from "rxjs";
import * as _ from "underscore";

import { FormComponent } from "../base/form/form.component";
import { ReportComponent } from "../base/report/report.component";
import { TriggersComponent } from "../base/triggers/triggers.component";
import { BusinessService } from "../business.service";
import { IdbService } from "../idb.service";

import {
  DashboardContainerInterface,
  DashboardGridInterface,
  DashboardSectionInterface,
  DashboardTabInterface,
  DashboardWidgetInterface
} from "serendip-business-model";
import { WidgetService } from "../widget.service";
import { WsService } from "../ws.service";
import { DashboardService } from "./../dashboard.service";
import { CalendarService } from "../calendar.service";
import { WeatherService } from "../weather.service";
import { GmapsService } from "../gmaps.service";
import { DataService } from "../data.service";
import { AuthService } from "../auth.service";

// optional import of scroll behavior
polyfill({
  // use this to make use of the scroll behavior
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
  explorerVisible = false;
  explorerAnimDone = true;

  search: { text: string; mode: string } = { text: "", mode: "contacts" };

  dashboardDate = "";
  dashboardTime = "";

  mapVisible = false;
  dashboardDateTimeInterval;
  dashboardDateTimeFormats = [
    "dddd jD jMMMM jYYYY",
    "dddd D MMMM YYYY",
    "jYYYY/jMM/jDD",
    "YYYY/MM/DD"
  ];
  screen: "mobile" | "desktop";
  gridSizeChange = new EventEmitter();
  dashboardSocket: WebSocket;
  private _grid: DashboardGridInterface;
  public get grid(): DashboardGridInterface {
    if (!this._grid) {
      return { containers: [] };
    } else {
      return this._grid;
    }
  }
  public set grid(v: DashboardGridInterface) {
    console.log("grid value change");
    this._grid = v;
  }
  fullNavTabs = [];

  dashboardReady = false;

  explorerAnimInTimeout = null;
  explorerAnimOutTimeout = null;
  rpd(input) {
    if (!input) {
      input = "";
    }
    const convert = a => {
      return ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][a];
    };
    return input.toString().replace(/\d/g, convert);
  }

  dashboardDateTimeTick() {
    // this.dashboardDateTimeFormats[0]
    let format = localStorage.getItem("dashboardDateTimeFormat");
    if (!format) {
      format = this.dashboardDateTimeFormats[0];
    }

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

  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public businessService: BusinessService,
    private idbService: IdbService,
    private changeRef: ChangeDetectorRef,
    private widgetService: WidgetService,
    private wsService: WsService,
    public calendarService: CalendarService,
    public weatherService: WeatherService,
    public authService: AuthService,
    public gmapsService: GmapsService,
    public dataService: DataService
  ) {
    moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });
  }

  clickOnStartWrapper(event: MouseEvent) {
    if ((event.target as HTMLElement).getAttribute("id") === "start") {
      document.getElementById("start").classList.remove("fadeIn");
    }
  }

  getExplorerTabs(tabs: any) {
    return _.filter(tabs, (tab: any) => {
      return tab.title != null && tab.name !== "default";
    });
  }

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
      const toAdd = layoutNumber - this.grid.containers.length;

      for (let i = 1; i <= toAdd; i++) {
        requestAnimationFrame(() => {
          this.addContainer();
        });
      }
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
        const activeTabsInContainer = _.where(cont.tabs, { active: true });
        if (
          activeTabsInContainer.length === 0 ||
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

    if (this.screen === "mobile") {
      return;
    }

    const targetPosition = (event.target as HTMLElement).parentElement.getBoundingClientRect();

    const handlerPosition = { top: event.clientY, left: event.clientX };

    // If handle is near left side of container its possible he needs another container

    if (handlerPosition.top > 100) {
      if (
        handlerPosition.left - targetPosition.left < 200 &&
        handlerPosition.left - targetPosition.left > 0
      ) {
        const notEmptyContainersCount = _.filter(
          this.grid.containers,
          container => {
            return container.tabs && container.tabs.length > 0;
          }
        ).length;

        // if (this.grid.containers.length < 3)
        if (
          notEmptyContainersCount - containerIndex === 1 &&
          !this.grid.containers[containerIndex + 1]
        ) {
          this.addContainer();
        }

        const grid = document.querySelector(".grid-container");
        if (containerIndex > 1) {
          grid.scroll({ left: grid.scrollLeft - 200, behavior: "smooth" });
        }
      }
    }
  }

  toggleCalendar() {
    this.weatherService.weatherVisible = false;
    this.hideStart();
    this.hideMap();
    this.calendarService.calendarVisible = !this.calendarService
      .calendarVisible;
  }
  toggleWeather() {
    this.calendarService.calendarVisible = false;
    this.hideStart();
    this.hideMap();
    this.weatherService.weatherVisible = !this.weatherService.weatherVisible;
  }

  toggleMap() {
    this.calendarService.calendarVisible = false;
    this.weatherService.weatherVisible = false;
    this.hideStart();
    this.gmapsService.dashboardMapVisible = this.gmapsService.dashboardMapVisible;
    this.gmapsService.emitSetMode({ mapId: "dashboard", mode: "explorer" });
    this.gmapsService.emitSetVisible({
      mapId: "dashboard",
      visible: this.mapVisible
    });
  }

  hideTools() {
    this.hideStart();
    this.hideMap();
    this.weatherService.weatherVisible = false;
    this.calendarService.calendarVisible = false;
  }

  hideMap() {
    this.mapVisible = false;
    this.gmapsService.emitSetVisible({
      mapId: "dashboard",
      visible: this.mapVisible
    });
  }
  definedItemsOfArray(array) {
    return _.filter(array, (item: any) => {
      return item !== undefined;
    });
  }

  onTabDrop(event: DndDropEvent | any, dropToContainerIndex) {
    console.log("onTabDrop");
    if (this.screen === "mobile") {
      this.explorerMouseOut();
    }

    const eventData: { containerIndex: number; tabIndex: number; tab: any } =
      event.data;

    if (eventData.tab) {
      if (eventData.tab.widgets[0].id) {
        if (
          JSON.stringify(this.grid.containers).indexOf(
            eventData.tab.widgets[0].id
          ) !== -1
        ) {
          return;
        }
      }
    }

    const toDrop =
      eventData.tab ||
      this.grid.containers[eventData.containerIndex].tabs[eventData.tabIndex];

    _.forEach(
      this.grid.containers[dropToContainerIndex].tabs,
      (tab: { active: boolean }) => {
        tab.active = false;
      }
    );

    if (eventData.containerIndex !== dropToContainerIndex) {
      toDrop.active = true;
    }

    if (eventData.containerIndex !== undefined) {
      this.grid.containers[eventData.containerIndex].tabs.splice(
        eventData.tabIndex,
        1
      );
    }

    this.grid.containers[dropToContainerIndex].tabs.push(toDrop);

    if (eventData.containerIndex !== undefined) {
      if (
        this.grid.containers[eventData.containerIndex].tabs.length === 1 ||
        _.where(this.grid.containers[eventData.containerIndex].tabs, {
          active: true
        }).length === 0
      ) {
        if (this.grid.containers[eventData.containerIndex].tabs[0]) {
          this.grid.containers[eventData.containerIndex].tabs[0].active = true;
        }
      }
    }

    this.syncGrid();
  }

  getExplorerSections(sections: DashboardSectionInterface[]) {
    return _.filter(sections, (sec: DashboardSectionInterface) => {
      return sec.name !== "dashboard";
    });
  }

  async initGrid(tabs: DashboardTabInterface[]) {
    console.log("initGrid");
    const tabsToAdd = _.clone(tabs);

    this.grid = { containers: [{ tabs: tabsToAdd }] };
    this.grid.version = Date.now();
    if (this.grid.containers[0].tabs[0]) {
      this.grid.containers[0].tabs[0].active = true;
    }

    if (this.dashboardService.screen === "desktop") {
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

  addContainer() {
    if (this.dashboardService.currentSection) {
      // JSON.parse(JSON.stringify(this.dashboardService.currentSection.tabs))
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
    return (options: { command: "open-tab"; tab: DashboardTabInterface }) => {
      const existInGrid = _.chain(this.grid.containers)
        .map((c: DashboardContainerInterface) => {
          return c.tabs;
        })
        .flatten()
        .map((t: DashboardTabInterface) => {
          return t.widgets;
        })
        .flatten()
        .any(w => {
          return (
            w &&
            w.inputs &&
            w.inputs.documentId === options.tab.widgets[0].inputs.documentId
          );
        })
        .value();

      if (existInGrid) {
        console.log("widget already exist");
        return;
      }

      if (window.innerWidth > 860) {
        let addedToCurrentContainers = false;
        let containerModifiedId = 0;
        for (let i = 0; i < this.grid.containers.length; i++) {
          if (this.grid.containers[i]) {
            if (this.grid.containers[i].tabs.length === 0) {
              this.grid.containers[i].tabs.push(options.tab);
              this.setActive(options.tab, this.grid.containers[i]);
              containerModifiedId = i;
              addedToCurrentContainers = true;
              break;
            }
          }
        }

        if (!addedToCurrentContainers) {
          this.grid.containers.push({ tabs: [options.tab] });
          containerModifiedId = this.grid.containers.length;
        }

        setTimeout(() => {
          const gridElem = document.querySelector(".grid-container");

          let navPassed = 0;
          let widthToRightOfGrid = 0;
          const tabContainers = document
            .querySelector(".grid-container")
            .querySelectorAll(".tabs-container") as any;
          tabContainers.forEach(tabContainer => {
            if (navPassed >= containerModifiedId) {
              return;
            } else {
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
        this.grid.containers[containerIndex].tabs.push(options.tab);
        this.setActive(options.tab, this.grid.containers[containerIndex]);
      }
    };
  }

  tabChange(containerIndex: number, tabIndex: number, widgetIndex: number) {
    return (newTab: DashboardTabInterface) => {
      this.grid.containers[containerIndex].tabs[tabIndex] = _.extend(
        this.grid.containers[containerIndex].tabs[tabIndex],
        newTab
      );
      this.syncGrid();
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
        this.dashboardSocket.readyState !== WebSocket.OPEN)
    ) {
      await this.newDashboardSocket();
    }

    localStorage.setItem(
      "grid-" + this.dashboardService.currentSection.name,
      JSON.stringify({
        section: this.dashboardService.currentSection.name,
        grid: this.grid,
        version: Date.now()
      })
    );

    this.dashboardSocket.send(
      JSON.stringify({
        command: "sync_grid",
        data: JSON.stringify({
          section: this.dashboardService.currentSection.name,
          grid: this.grid
        })
      })
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
    if (tab.widgets) {
      return tab.widgets;
    } else {
      return [];
    }
  }

  ngOnDestroy(): void {
    if (this.dashboardDateTimeInterval) {
      clearInterval(this.dashboardDateTimeInterval);
    }
  }

  //
  closeTab(containerIndex, tabIndex) {
    this.grid.containers[containerIndex].tabs.splice(tabIndex, 1);

    if (
      this.grid.containers[containerIndex].tabs.length === 1 ||
      _.where(this.grid.containers[containerIndex].tabs, {
        active: true
      }).length === 0
    ) {
      if (this.grid.containers[containerIndex].tabs[0]) {
        this.grid.containers[containerIndex].tabs[0].active = true;
      }
    }
  }

  async handleStartButtonMove() {
    const elem = document.getElementById("start-button");

    let captureMove = false;
    let moved = false;
    let elemPos = { x: elem.offsetLeft, y: elem.offsetTop };
    let startPos = { x: 0, y: 0 };

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
      if (!captureMove) {
        return;
      }

      document.querySelector("body").setAttribute("style", "overflow:hidden;");

      elem.classList.add("moving");

      const movePos = {
        x: move_ev.clientX || move_ev.touches[0].clientX,
        y: move_ev.clientY || move_ev.touches[0].clientY
      };

      const destPos = {
        x: elemPos.x - (startPos.x - movePos.x),
        y: elemPos.y - (startPos.y - movePos.y)
      };

      if (
        destPos.x < 5 ||
        destPos.x >
          window.innerWidth -
            (this.dashboardService.screen === "mobile" ? 37 : 69)
      ) {
        return;
      }

      if (
        destPos.y < 5 ||
        destPos.y >
          window.innerHeight -
            (this.dashboardService.screen === "mobile" ? 37 : 69)
      ) {
        return;
      }

      elem.setAttribute("style", `top:${destPos.y}px;left:${destPos.x}px;`);
      moved = true;
    };
    document.ontouchend = document.onmouseup = (ev: any) => {
      if (captureMove) {
        captureMove = false;
        elem.classList.remove("moving");
        document.querySelector("body").removeAttribute("style");

        if (ev instanceof MouseEvent) {
          if (!moved) {
            document.getElementById("start").classList.toggle("fadeIn");
            document.querySelector("body").classList.toggle("hideScroll");
          }
        }
      }
    };
  }

  hideStart() {
    document.getElementById("start").classList.remove("fadeIn");
  }

  showStart() {
    document.getElementById("start").classList.add("fadeIn");
  }
  isNavTabFull(navTabId) {
    return this.fullNavTabs.indexOf(navTabId) !== -1;
  }

  adjustLayout() {
    const gridElem = document.querySelector(".grid-container");

    if (!gridElem) {
      return;
    }

    const gridRect = gridElem.getBoundingClientRect();

    const count = Math.round(gridRect.width / 420);

    if (count === 1 || count > this.grid.containers.length) {
      this.setGridLayout(count);
    }
  }

  handleFullNav() {
    setInterval(() => {
      _.forEach(document.querySelectorAll("ul.tabs-nav"), navTab => {
        const navTabId = navTab.getAttribute("id");

        const container = this.grid.containers[
          parseInt(navTabId.split("-").reverse()[0], 10)
        ];
        if (!container) {
          return;
        }

        let listItemsWith = 0;

        document
          .querySelectorAll("#" + navTabId + " li")
          .forEach((item: HTMLElement) => {
            if (!item.classList.contains("full-nav")) {
              listItemsWith += item.getBoundingClientRect().width;
            }
          });

        const isFull =
          navTab.getBoundingClientRect().width - listItemsWith < 10;

        console.log(
          listItemsWith,
          navTab.getBoundingClientRect().width,
          isFull
        );
        // var isFull = navTab.getBoundingClientRect().width <= _.reduceRight(navTab.querySelectorAll("li"), (memo, item: HTMLElement) => {
        //   return memo + item.getBoundingClientRect().width;
        // }, 0);

        // isFull = false;

        if (isFull) {
          if (this.fullNavTabs.indexOf(navTabId) === -1) {
            this.fullNavTabs.push(navTabId);
          }
        } else {
          if (this.fullNavTabs.indexOf(navTabId) !== -1) {
            this.fullNavTabs.splice(this.fullNavTabs.indexOf(navTabId), 1);
          }
        }
      });
    }, 100);
  }

  handleGridMouseDragScroll() {
    let capture = false;
    let lastCapture = 0;
    const grid = document.querySelector(".grid-container") as any;
    let last = { x: 0, y: 0 };
    const captureTimeout = null;
    grid.onmousewheel = (ev: MouseWheelEvent) => {
      const target = ev.target as HTMLElement;
      if (
        Date.now() - lastCapture < 500 ||
        target.classList.contains("grid-container") ||
        target.classList.contains("tabs-container")
      ) {
        lastCapture = Date.now();
        if (ev.deltaY < 0) {
          grid.scroll({ left: grid.scrollLeft - 100, behavior: "instant" });
        } else {
          grid.scroll({ left: grid.scrollLeft + 100, behavior: "instant" });
        }
      }
    };

    grid.onmousedown = (down_ev: MouseEvent) => {
      const target = down_ev.target as HTMLElement;

      if (
        target.classList.contains("grid-container") ||
        target.classList.contains("tabs-container")
      ) {
        if (captureTimeout) {
          clearTimeout(captureTimeout);
        }

        capture = true;
        last = { x: down_ev.clientX, y: down_ev.clientY };
      }
    };

    let gridEdgeTimeout;
    let gridEdgeScrollInterval;
    grid.onmousemove = (move_ev: MouseEvent) => {
      if (capture) {
        grid.scroll({
          left: grid.scrollLeft - (move_ev.clientX - last.x),
          behavior: "instant"
        });
        last = { x: move_ev.clientX, y: move_ev.clientY };
      }
    };

    grid.onmouseover = grid.touchstart = ev => {
      if (gridEdgeScrollInterval) { clearInterval(gridEdgeScrollInterval); }

      if (gridEdgeTimeout) { clearTimeout(gridEdgeTimeout); }
      const mousePosition = { x: ev.clientX, y: ev.clientY };
      if (mousePosition.x < 50) {
        gridEdgeTimeout = setTimeout(() => {
          gridEdgeScrollInterval = setInterval(() => {
            grid.scroll({ left: grid.scrollLeft - 150, behavior: "smooth" });
          }, 500);
        }, 500);
      }

      if (window.innerWidth - mousePosition.x < 100) {
        gridEdgeTimeout = setTimeout(() => {
          gridEdgeScrollInterval = setInterval(() => {
            grid.scroll({ left: grid.scrollLeft + 150, behavior: "smooth" });
          }, 500);
        }, 500);
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
      const msg: {
        command: "change_grid";
        data: {
          version: number;
          section: string;
          grid: DashboardGridInterface;
        };
      } = JSON.parse(ev.data);

      msg.data = JSON.parse(msg.data as any);

      if (
        msg.command === "change_grid" &&
        msg.data.version > this.grid.version
      ) {
        localStorage.setItem(
          "grid-" + msg.data.section,
          JSON.stringify(msg.data)
        );
        console.log("should chang grid");
        if (this.dashboardService.currentSection === msg.data.section) {
          this.grid = msg.data.grid;
        }
        this.changeRef.markForCheck();
      }
      console.log(msg);
    };
  }

  async handleParams(params) {
    console.log("handleParams", params);

    this.dashboardService.currentSection = _.findWhere(
      this.dashboardService.schema.dashboard,
      {
        name: params.section || "dashboard"
      }
    );

    let localGrid: any = localStorage.getItem("grid" + params.section);
    if (localGrid) {
      localGrid = JSON.parse(localGrid);
    }

    let remoteGrid;
    try {
      remoteGrid = await this.dataService.request({
        method: "post",
        path: "/api/business/grid",
        model: { section: params.section },
        timeout: 100,
        retry: false
      });
    } catch (error) {}

    console.log("remoteGrid", remoteGrid, "localGrid", localGrid);
    if (localGrid && localGrid.version) {
      if (remoteGrid) {
        if (localGrid.version > remoteGrid.version) {
          this.grid = localGrid.grid;
          this.changeRef.detectChanges();

          return;
        }
      } else {
        this.grid = localGrid.grid;
        this.changeRef.detectChanges();

        return;
      }
    }

    if (remoteGrid && remoteGrid.version) {
      if (!localGrid) {
        this.grid = remoteGrid.grid;
        this.changeRef.detectChanges();

        return;
      } else {
        if (localGrid.version < remoteGrid.version) {
          this.grid = remoteGrid.grid;
          this.changeRef.detectChanges();
          return;
        }
      }
    }

    await this.initGrid(this.dashboardService.currentSection.tabs);
  }
  async ngOnInit() {
    this.newDashboardSocket()
      .then(() => {})
      .catch(() => {});

    await this.dashboardService.setDefaultSchema();

    this.gridSizeChange.subscribe(() => {
      this.adjustLayout();
    });

    this.handleParams(this.activatedRoute.snapshot.params);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.handleParams(this.activatedRoute.snapshot.params);
      }
    });

    window.onresize = () => {
      this.gridSizeChange.emit();
    };

    this.gridSizeChange.emit();

    this.handleFullNav();
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
  }
}
