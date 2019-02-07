import { Component, OnInit, Input } from "@angular/core";
import * as sutils from "serendip-utility";
import * as _ from "underscore";
@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.less"]
})
export class ChartComponent implements OnInit {
  constructor() {}
  chartId = `chart-${Date.now()}`;

  @Input() chartType: string;
  loading = true;
  @Input() data  ;

  ngOnInit() {
    setTimeout(() => {
      _.forEach(document.querySelectorAll(`.chart-container text`), elem => {
        elem.innerHTML = sutils.text.replaceEnglishDigitsWithPersian(
          elem.innerHTML
        );
      });

      setTimeout(() => {
        this.loading = false;
      }, 500);
    }, 100);
  }
}
