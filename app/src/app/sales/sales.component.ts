import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateRange, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { map, subscribeOn } from 'rxjs/operators';
import { MenuService } from '../business-menu/menu-service.service';
import { MenuItem } from '../interfaces/menu-item';
import { Sale } from '../interfaces/sale';
import { Store } from '../interfaces/store';
import { SaleService } from '../services/sale-service.service';
import { StoreService } from '../services/store-service.service';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';

const date = new Date();

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.less']
})

export class SalesComponent implements OnInit {
  @ViewChild('salesOverview')
  salesOverview!: SalesOverviewComponent;

  sales !: Sale[];
  menuItems !: MenuItem[];
  stores !: Store[];  
  
  startDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
  endDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  startDateStr: string = this.startDate.toISOString().slice(0, 19).replace('T', ' ');
  endDateStr: string = this.endDate.toISOString().slice(0, 19).replace('T', ' ');

  constructor(private saleService: SaleService, 
    private menuService: MenuService,
    private storeService: StoreService,
    ) {
  }

  tableMenuItemsChanged(message: string){

    // Update Charts - since menu items have changed in child (table) component

  }

  updateSaleDate(event: any, isStartDate: boolean){
    if (this.startDate){
      this.startDateStr = this.startDate.toISOString().slice(0, 19).replace('T', ' ');
    }
    if (this.endDate){
      this.endDateStr = this.endDate.toISOString().slice(0, 19).replace('T', ' ');
    }
    this.sharedFunction();
    this.saleService.getSales(this.startDateStr, this.endDateStr)
    .subscribe(
      result => {
        this.sales = result;
      },
      err => {
      }
    )
  }

  sharedFunction() : void{
    this.salesOverview.updateChartData();

  }

  ngOnInit(): void {
    this.menuService.getMenuItems()
      .subscribe(
        result => {
          this.menuItems = result;
        },
        err => {
        });

      this.saleService.getSales(this.startDateStr, this.endDateStr)
        .subscribe(
          result => {
            this.sales = result;
          },
          err => {
          }
        )

        
      this.storeService.getStores()
      .subscribe(
        result => {
          this.stores = result;
        },
        err => {
        }
      )
  }
  
}
