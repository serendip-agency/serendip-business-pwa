import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { GmapsService } from '../gmaps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit, OnDestroy {

  selectedPositionChange: boolean = false;
  selectPositionActionsVisible: boolean;
  mapVisible = false;
  constructor(
    public dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public crmService: CrmService,
    public gmapsService: GmapsService,
  ) {

  }


  ngOnInit() {


    this.gmapsService.events.on('selectedPositionChange', (value) => {

      console.log(value);
      
      if (value)
        this.selectedPositionChange = true;
      else
        this.selectedPositionChange = false;

    });

    this.gmapsService.events.on('selectPosition', () => {

      this.selectedPositionChange = false;
      this.gmapsService.events.on('mapInitDone', () => {
        this.selectPositionActionsVisible = true;
      });
    });


    this.gmapsService.events.on('selectPositionDone', () => {
      this.selectPositionActionsVisible = false;
    });

    this.gmapsService.events.on('selectPositionCancel', () => {
      this.selectPositionActionsVisible = false;
    });


    this.gmapsService.events.on('mapClose', () => {
      this.mapVisible = false;
    });


    this.gmapsService.events.on('mapOpen', () => {
      this.mapVisible = true;
    });




  }

  ngOnDestroy(): void {


  }



}
