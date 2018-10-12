import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as sutils from 'serendip-utility'
import * as _ from "underscore";

@Component({
  selector: 'app-outcome-by-campaign',
  templateUrl: './outcome-by-campaign.component.html',
  styleUrls: ['./outcome-by-campaign.component.css']
})
export class OutcomeByCampaignComponent implements OnInit {

  data = [
    {
      name: 'ت. وب',
      value: 450
    },
    {
      name: 'ت. بصری',
      value: 600
    },
    {
      name: 'ت. پیامکی',
      value: 100
    }
  ];

  view = [300, 300];


  constructor(private changeRef: ChangeDetectorRef) { }
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

    this.data = [...this.data];
    this.changeRef.detectChanges();
  }

  fadeIn() {
    var elem = document.getElementById(this.chartId);
    if (elem)
      elem.classList.add("fadeIn");
    else
      setTimeout(() => {
        this.fadeIn();
      }, 2000);
  }



  ngOnInit() {

    console.log(`init chart ${this.chartId}`);
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
