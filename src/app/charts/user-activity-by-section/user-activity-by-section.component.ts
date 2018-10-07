import { Component, OnInit } from '@angular/core';
import * as sutils from 'serendip-utility'
import * as _ from "underscore";

@Component({
  selector: 'app-user-activity-by-section',
  templateUrl: './user-activity-by-section.component.html',
  styleUrls: ['./user-activity-by-section.component.css']
})
export class UserActivityBySectionComponent implements OnInit {

  constructor() {

  }

  chartId = `chart-${Date.now()}`;

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

  ngOnInit() {



    setTimeout(() => {

      _.forEach(document.querySelectorAll(`.chart-container text`), (elem) => {

        elem.innerHTML = sutils.text.replaceEnglishDigitsWithPersian(elem.innerHTML);

      });



    }, 100)
  }



}
