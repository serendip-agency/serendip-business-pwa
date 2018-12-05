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
import * as lunr from "lunr";
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
import { MatSnackBar } from "@angular/material";
import swal from "sweetalert2";
import { text, validate } from "serendip-utility";

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

  textUtils = text;
  search: {
    /**
     * Entity name or ...
     */
    mode: string;
    didYouMean: string;
    text: string;
    results: { [key: string]: { docId: string; score: number } }[];
  } = { mode: "", text: "", didYouMean: "", results: [] };

  dashboardDate = "";
  dashboardTime = "";
  dashboardLoadingText = "";
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
  tabDragging: DashboardTabInterface;
  public get grid(): DashboardGridInterface {
    if (!this._grid) {
      return { containers: [] };
    } else {
      return this._grid;
    }
  }
  public set grid(v: DashboardGridInterface) {
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

  getModeIcon(mode) {
    const section = _.findWhere(this.dashboardService.schema.dashboard, {
      name: mode
    });

    if (section) {
      return section.icon;
    } else {
      return "folder-archive-open";
    }
  }

  getInputDirection(input: string) {
    if (!input) {
      return "rtl";
    }

    return text.englishKeyChar.indexOf(input[0] || " ") === -1 ? "rtl" : "ltr";
  }
  doSearch(q) {
    this.search.didYouMean = "";

    if (!q) {
      return;
    }

    q = text.replaceArabicDigitsWithEnglish(q);
    q = text.replacePersianDigitsWithEnglish(q);
    q = text.replaceArabicCharWithPersian(q);

    let foundAnyThing = false;
    Object.keys(this.dataService.collectionsTextIndexCache).forEach(
      entityName => {
        let result = this.dataService.collectionsTextIndexCache[
          entityName
        ].search(q);
        this.search.results[entityName] = result;
        if (result.lenght > 0) {
          foundAnyThing = true;
        }
      }
    );

    if (!foundAnyThing) {
      const matchAnyCommonEnglishWord =
        this.dataService.commonEnglishWordsIndexCache.search(q).length > 0;
      if (
        text.englishKeyChar.indexOf(q[0] || " ") !== -1 &&
        !matchAnyCommonEnglishWord &&
        !validate.isNumeric(q)
      ) {
        this.search.didYouMean = text.switchEnglishKeyToPersian(q);
      }
    }
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
    public dataService: DataService,
    private snackBar: MatSnackBar
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

  tabDragStart(tab: DashboardTabInterface) {
    this.tabDragging = tab;
  }

  tabDragEnd() {
    this.tabDragging = null;
  }
  onTabDragover(event: DragEvent, containerIndex: number) {
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
    this.gmapsService.dashboardMapVisible = !this.gmapsService
      .dashboardMapVisible;
    this.gmapsService.emitSetMode({ mapId: "dashboard-map", mode: "explorer" });
    this.gmapsService.emitSetVisible({
      mapId: "dashboard-map",
      visible: this.gmapsService.dashboardMapVisible
    });
  }

  hideTools() {
    this.hideStart();
    this.hideMap();
    this.weatherService.weatherVisible = false;
    this.calendarService.calendarVisible = false;
  }

  hideMap() {
    this.gmapsService.dashboardMapVisible = false;
    this.gmapsService.emitSetVisible({
      mapId: "dashboard-map",
      visible: this.gmapsService.dashboardMapVisible
    });
  }
  definedItemsOfArray(array) {
    return _.filter(array, (item: any) => {
      return item !== undefined;
    });
  }

  onTabDrop(event: DndDropEvent | any, dropToContainerIndex) {
    if (this.screen === "mobile") {
      this.explorerMouseOut();
    }

    const eventData: { containerIndex: number; tabIndex: number; tab: any } =
      event.data;

    if (!eventData) {
      return;
    }

    if (!eventData.tab && typeof eventData.tabIndex !== "number") {
      return;
    }

    this.tabDragging = null;

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
      // FIXME:S
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
            w.component === options.tab.widgets[0].component &&
            w.inputs.documentId === options.tab.widgets[0].inputs.documentId
          );
        })
        .value();

      if (existInGrid) {
        console.warn("widget already exist");
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

  async syncGrid() {
    this.grid.version = Date.now();

    console.warn("syncing grid ...");

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

  startButtonClick() {
    document.getElementById("start").classList.toggle("fadeIn");
    document.querySelector("body").classList.toggle("hideScroll");
  }
  async handleStartButtonMove() {
    return;
    // const elem = document.getElementById("start-button");

    // let captureMove = false;
    // let moved = false;
    // let elemPos = { x: elem.offsetLeft, y: elem.offsetTop };
    // let startPos = { x: 0, y: 0 };

    // elem.ontouchstart = elem.onmousedown = (start_ev: any) => {
    //   elemPos = { x: elem.offsetLeft, y: elem.offsetTop };
    //   captureMove = true;
    //   moved = false;

    //   startPos = {
    //     x: start_ev.clientX || start_ev.touches[0].clientX,
    //     y: start_ev.clientY || start_ev.touches[0].clientY
    //   };
    // };

    // document.ontouchmove = document.onmousemove = (move_ev: any) => {
    //   if (!captureMove) {
    //     return;
    //   }

    //   document.querySelector("body").setAttribute("style", "overflow:hidden;");

    //   elem.classList.add("moving");

    //   const movePos = {
    //     x: move_ev.clientX || move_ev.touches[0].clientX,
    //     y: move_ev.clientY || move_ev.touches[0].clientY
    //   };

    //   const destPos = {
    //     x: elemPos.x - (startPos.x - movePos.x),
    //     y: elemPos.y - (startPos.y - movePos.y)
    //   };

    //   if (
    //     destPos.x < 5 ||
    //     destPos.x >
    //       window.innerWidth -
    //         (this.dashboardService.screen === "mobile" ? 37 : 69)
    //   ) {
    //     return;
    //   }

    //   if (
    //     destPos.y < 5 ||
    //     destPos.y >
    //       window.innerHeight -
    //         (this.dashboardService.screen === "mobile" ? 37 : 69)
    //   ) {
    //     return;
    //   }

    //   elem.setAttribute("style", `top:${destPos.y}px;left:${destPos.x}px;`);
    //   moved = true;
    // };

    // document.ontouchend = document.onmouseup = (ev: any) => {
    //   if (captureMove) {
    //     captureMove = false;
    //     elem.classList.remove("moving");
    //     document.querySelector("body").removeAttribute("style");

    //     if (ev instanceof MouseEvent) {
    //       if (!moved) {
    //         document.getElementById("start").classList.toggle("fadeIn");
    //         document.querySelector("body").classList.toggle("hideScroll");
    //       }
    //     }
    //   }
    // };
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

    if (gridRect.width < 860) {
      this.setGridLayout(1);
    } else {
      this.setGridLayout(10);
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

        (document.querySelectorAll("#" + navTabId + " li") as any).forEach(
          (item: HTMLElement) => {
            if (!item.classList.contains("full-nav")) {
              listItemsWith += item.getBoundingClientRect().width;
            }
          }
        );

        const isFull =
          navTab.getBoundingClientRect().width - listItemsWith < 10;

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

  sync() {
    return new Promise((resolve, reject) => {
      this.dashboardLoadingText = "همگام سازی شروع شد ...";

      const syncStart = Date.now();
      this.dataService
        .sync()
        .then(() => {
          const seconds = ((Date.now() - syncStart) / 1000).toFixed(1);
          this.dashboardLoadingText = `همگام سازی در ${this.rpd(
            seconds
          )} ثانیه انجام شد.`;

          resolve();
        })
        .catch(e => {
          this.dashboardLoadingText = "همگام سازی با خطا مواجه شد.";
          console.error(e);
        });
    });
  }
  getClosest(elem, selector) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          let matches = (this.document || this.ownerDocument).querySelectorAll(
              s
            ),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) {
        return elem;
      }
    }
    return null;
  }
  handleGridMouseDragScroll() {
    let capture = false;
    let lastCapture = 0;
    const grid = document.querySelector(".grid-container") as any;
    let last = { x: 0, y: 0 };
    const captureTimeout = null;
    grid.onmousewheel = (ev: MouseWheelEvent) => {
      const target = ev.target as HTMLElement;

      if (!this.getClosest(target, ".mat-card-content")) {
        lastCapture = Date.now();
        if (ev.deltaY < 0) {
          grid.scroll({ left: grid.scrollLeft - 100, behavior: "instant" });
        } else {
          grid.scroll({ left: grid.scrollLeft + 100, behavior: "instant" });
        }
      }
    };

    grid.onmouseleave = () => {
      capture = false;
    };
    grid.onmousedown = (down_ev: MouseEvent) => {
      const target = down_ev.target as HTMLElement;

      if (
        !this.getClosest(target, ".mat-card-content") &&
        !this.getClosest(target, ".tab-handle") &&
        target.id !== "start-button"
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

    // grid.onmouseover = grid.touchstart = ev => {
    //   if (gridEdgeScrollInterval) { clearInterval(gridEdgeScrollInterval); }

    //   if (gridEdgeTimeout) { clearTimeout(gridEdgeTimeout); }
    //   const mousePosition = { x: ev.clientX, y: ev.clientY };
    //   if (mousePosition.x < 50) {
    //     gridEdgeTimeout = setTimeout(() => {
    //       gridEdgeScrollInterval = setInterval(() => {
    //         grid.scroll({ left: grid.scrollLeft - 150, behavior: "smooth" });
    //       }, 500);
    //     }, 500);
    //   }

    //   if (window.innerWidth - mousePosition.x < 100) {
    //     gridEdgeTimeout = setTimeout(() => {
    //       gridEdgeScrollInterval = setInterval(() => {
    //         grid.scroll({ left: grid.scrollLeft + 150, behavior: "smooth" });
    //       }, 500);
    //     }, 500);
    //   }
    // };
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
      if (msg.command === "change_grid") {
        localStorage.setItem(
          "grid-" + msg.data.section,
          JSON.stringify(msg.data)
        );

        if (
          msg.data.section === this.dashboardService.currentSection.name &&
          msg.data.version > this.grid.version
        ) {
          console.log("should chang grid");
          if (this.dashboardService.currentSection === msg.data.section) {
            this.grid = msg.data.grid;
          }
          this.changeRef.markForCheck();
        }
      }
    };
  }

  async handleParams(params) {
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
      // remoteGrid = await this.dataService.request({
      //   method: "post",
      //   path: "/api/business/grid",
      //   model: { section: params.section },
      //   timeout: 100,
      //   retry: false
      // });
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
  memorySizeOf(obj) {
    let bytes = 0;

    function sizeOf(obj) {
      if (obj !== null && obj !== undefined) {
        switch (typeof obj) {
          case "number":
            bytes += 8;
            break;
          case "string":
            bytes += obj.length * 2;
            break;
          case "boolean":
            bytes += 4;
            break;
          case "object":
            const objClass = Object.prototype.toString.call(obj).slice(8, -1);
            if (objClass === "Object" || objClass === "Array") {
              for (const key in obj) {
                if (!obj.hasOwnProperty(key)) {
                  continue;
                }
                sizeOf(obj[key]);
              }
            } else {
              bytes += obj.toString().length * 2;
            }
            break;
        }
      }
      return bytes;
    }

    function formatByteSize(bytes) {
      if (bytes < 1024) {
        return bytes + " bytes";
      } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(3) + " KiB";
      } else if (bytes < 1073741824) {
        return (bytes / 1048576).toFixed(3) + " MiB";
      } else {
        return (bytes / 1073741824).toFixed(3) + " GiB";
      }
    }

    return formatByteSize(sizeOf(obj));
  }

  wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  async ngOnInit() {
    await this.sync();

    await this.wait(500);

    this.dashboardReady = true;

    this.newDashboardSocket()
      .then(() => {})
      .catch(() => {});

    this.dashboardService.dashboardCommand.on("command", command => {
      this.dashboardCommand(0, 0, 0)(command);
    });

    await this.dashboardService.setDefaultSchema();

    this.gridSizeChange.subscribe(() => {
      this.adjustLayout();
    });
    setTimeout(() => {
      this.adjustLayout();
    }, 1000);
    this.handleParams(this.activatedRoute.snapshot.params);

    this.router.events.subscribe(async (event: any) => {
      if (event instanceof NavigationEnd) {
        await this.handleParams(this.activatedRoute.snapshot.params);
        setTimeout(() => {
          this.adjustLayout();
        }, 1000);
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

    // // FIXME: for test
    // document.getElementById("start").classList.toggle("fadeIn");
    // document.querySelector("body").classList.toggle("hideScroll");

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
