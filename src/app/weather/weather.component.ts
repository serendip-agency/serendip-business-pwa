import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";

import * as Moment from "moment";
import * as MomentJalaali from "moment-jalaali";
import * as _ from "underscore";
import { WeatherService } from "../weather.service";

@Component({
  selector: "app-weather",
  templateUrl: "./weather.component.html",
  styleUrls: ["./weather.component.less"]
})
export class WeatherComponent implements OnInit {
  model: any = {};
  moment: typeof Moment;

  lastKey: number;
  keys;
  ajaxTimeout;
  constructor(
    public dataService: DataService,
    public weatherService: WeatherService
  ) {
    this.moment = MomentJalaali;
  }

  getWeather() {
    return new Promise(async (resolve, reject) => {
      this.ajaxTimeout = setTimeout(async () => {
        try {
          this.model = (await this.dataService.request({
            method: "GET",
            host: "http://weather.serendip.cloud",
            path: "/api/search",
            model: { q: "Tehran, Iran" }
          }))[0];
          if (this.model) this.model.ajaxDate = Date.now();
          resolve(this.model);
        } catch (e) {
          reject(e);
        }
      }, 100);

      if (localStorage.getItem("weather")) {
        try {
          this.model = JSON.parse(localStorage.getItem("weather"));
        } catch (error) {}
      }

      if (this.model) {
        if (Date.now() - this.model.ajaxDate < 1000 * 60 * 60 * 6) {
          if (this.ajaxTimeout) {
            clearTimeout(this.ajaxTimeout);
          }

          resolve(this.model);
        }
      }
    });
  }
  async refresh() {
    console.log(await this.getWeather());
  }

  async ngOnInit() {
    this.refresh();
  }
}
