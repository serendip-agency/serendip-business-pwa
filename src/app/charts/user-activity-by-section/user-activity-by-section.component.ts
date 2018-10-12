import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as sutils from 'serendip-utility'
import * as _ from "underscore";

@Component({
  selector: 'app-user-activity-by-section',
  templateUrl: './user-activity-by-section.component.html',
  styleUrls: ['./user-activity-by-section.component.css']
})
export class UserActivityBySectionComponent implements OnInit {
  animations: boolean = true;

  constructor(private changeRef: ChangeDetectorRef) { }

  data = [
    {
      "name": "م. اسماعیلی",
      "series": [
        {
          "value": 10,
          "name": "خدمات"
        },
        {
          "value": 5,
          "name": "شکایات"
        },
        {
          "value": 20,
          "name": "فروش"
        }

      ]
    },
    {
      "name": "و. بزاز",
      "series": [
        {
          "value": 5,
          "name": "خدمات"
        },
        {
          "value": 15,
          "name": "شکایات"
        },
        {
          "value": 10,
          "name": "فروش"
        }
      ]
    },
    {
      "name": "خ. کریمی",
      "series": [
        {
          "value": 4,
          "name": "خدمات"
        },
        {
          "value": 8,
          "name": "شکایات"
        },
        {
          "value": 1,
          "name": "فروش"
        }
      ]
    }
  ]

  view = [300, 300];

  chartId = `chart-${Date.now()}`;


  adjustSize() {
    var chartContainer = document.getElementById(this.chartId);
    if (!chartContainer)
      return;

    var containerWidth = chartContainer.getBoundingClientRect().width

    if (containerWidth > 500)
      containerWidth = 500;


    if (containerWidth < 220)
      return;

    if (containerWidth == this.view[0])
      return;

    this.view[0] = containerWidth;
    this.view[1] = containerWidth;

    console.log('polar', containerWidth);

    this.data = [...this.data];
    this.changeRef.detectChanges();
  }

  fadeIn() {
    var elem = document.getElementById(this.chartId);
    if (elem) {
      elem.classList.add("fadeIn");
      setTimeout(() => {
        this.animations = false;
      }, 2000);
    }
    else
      setTimeout(() => {
        this.fadeIn();
      }, 2000);
  }
  ngOnInit() {

    setTimeout(() => {
      this.fadeIn();


    }, 2000);

    setInterval(() => {
      this.adjustSize();

      _.forEach(document.querySelectorAll(`.chart-container text`), (elem) => {
        if (elem.querySelectorAll("tspan").length > 0)
          (elem.querySelectorAll("tspan") as any).forEach((tspan) => {
            tspan.innerHTML = sutils.text.replaceEnglishDigitsWithPersian(tspan.innerHTML);
          });
        else
          elem.innerHTML = sutils.text.replaceEnglishDigitsWithPersian(elem.innerHTML);
      });
    }, 1000);

  }




}
