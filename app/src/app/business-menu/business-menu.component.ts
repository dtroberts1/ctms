import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item';
import { MenuService } from './menu-service.service';

@Component({
  selector: 'app-business-menu',
  templateUrl: './business-menu.component.html',
  styleUrls: ['./business-menu.component.less']
})

export class BusinessMenuComponent implements OnInit {
  menuItems!: MenuItem[];

  constructor(private menuService: MenuService) {
  }

  tableMenuItemsChanged(message: string){

    // Update Charts - since menu items have changed in child (table) component
  }

  ngOnInit(): void {
    this.menuService.getMenuItems()
      .subscribe((menuItems: MenuItem[]) => {
        this.menuItems = menuItems
      })
  }

}
