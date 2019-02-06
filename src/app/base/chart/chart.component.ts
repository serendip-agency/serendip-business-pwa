import { Component, OnInit, Input } from "@angular/core";
import * as sutils from "serendip-utility";
import * as _ from "underscore";
@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent implements OnInit {
  constructor() {}
  chartId = `chart-${Date.now()}`;

  @Input() chartType: string;
  loading = true;
  @Input() data = [
    {
      name: "م. اسماعیلی",
      series: [
        {
          value: 10,
          name: "خدمات"
        },
        {
          value: 5,
          name: "شکایات"
        },
        {
          value: 20,
          name: "فروش"
        }
      ]
    },
    {
      name: "و. بزاز",
      series: [
        {
          value: 5,
          name: "خدمات"
        },
        {
          value: 15,
          name: "شکایات"
        },
        {
          value: 10,
          name: "فروش"
        }
      ]
    },
    {
      name: "خ. کریمی",
      series: [
        {
          value: 4,
          name: "خدمات"
        },
        {
          value: 8,
          name: "شکایات"
        },
        {
          value: 1,
          name: "فروش"
        }
      ]
    }
  ];

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
