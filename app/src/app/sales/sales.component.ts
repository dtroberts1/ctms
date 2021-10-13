import { Component, OnInit } from '@angular/core';
import { map, subscribeOn } from 'rxjs/operators';
import { MenuService } from '../business-menu/menu-service.service';
import { MenuItem } from '../interfaces/menu-item';
import { Sale } from '../interfaces/sale';
import { SaleService } from '../services/sale-service.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.less']
})
export class SalesComponent implements OnInit {
  sales !: Sale[];
  menuItems !: MenuItem[];
  constructor(private saleService: SaleService, private menuService: MenuService) {
  }

  tableMenuItemsChanged(message: string){

    // Update Charts - since menu items have changed in child (table) component
  }

  ngOnInit(): void {
    this.menuService.getMenuItems()
      .subscribe(
        result => {
          this.menuItems = result;
        },
        err => {
        });

      this.saleService.getSales()
        .subscribe(
          result => {
            this.sales = result;
          },
          err => {
          }
        )
  }
  
}
