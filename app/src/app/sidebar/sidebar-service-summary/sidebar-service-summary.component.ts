import { Component, OnInit } from '@angular/core';
import { ServiceQualityService } from 'src/app/services/service-quality.service';
import { StoreService } from 'src/app/services/store-service.service';

@Component({
  selector: 'app-sidebar-service-summary',
  templateUrl: './sidebar-service-summary.component.html',
  styleUrls: ['./sidebar-service-summary.component.less']
})
export class SidebarServiceSummaryComponent implements OnInit {
  storeServiceList!: any[];
  employeeServiceList!: any[];

  constructor(
    private serviceQualityService: ServiceQualityService,
  ) { }

  ngOnInit(): void {
    this.serviceQualityService.getStoreServiceSummaries()
      .subscribe(
        res => {
          if (Array.isArray(res) && res.length){
            this.storeServiceList = res.slice(0, 10);
          }
        },
        
        err => {

        },
      );

      this.serviceQualityService.getEmployeeServiceSummaries()
      .subscribe(
        res => {
          if (Array.isArray(res) && res.length){
            this.employeeServiceList = res.slice(0, 10);
          }
        },
        
        err => {

        },
      );
  }

}
