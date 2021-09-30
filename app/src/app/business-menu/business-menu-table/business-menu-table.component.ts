import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MenuItem } from '../../menu-item';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MenuService } from '../menu-service.service';


/*const menuItems : MenuItem[] = [
  {
    type: 'coffee',
    name: 'House Coffee',
    description: 'House Coffee Description',
    ingredients: [],
    price: 3.48,
    cost: 0.48,
    ranking: 11,
  },
  {
    type: 'coffee',
    name: 'Americano',
    description: 'Americano Description',
    ingredients: [],
    price: 4.13,
    cost: 0.18,
    ranking: 10,
  },
  {
    type: 'espresso',
    name: 'Latte',
    description: 'Latte Description',
    ingredients: [],
    price: 3.93,
    cost: 0.58,
    ranking: 14,
  },
  {
    type: 'espresso',
    name: 'Mocha',
    description: 'Mocha Description',
    ingredients: [],
    price: 2.93,
    cost: 0.88,
    ranking: 4,
  },
  {
    type: 'espresso',
    name: 'White Mocha',
    description: 'White Mocha Description',
    ingredients: [],
    price: 2.93,
    cost: 0.88,
    ranking: 5,
  },
  {
    type: 'beverage',
    name: 'Hot Chocolate',
    description: 'Hot Chocolate Description',
    ingredients: [],
    price: 3.03,
    cost: 1.48,
    ranking: 2,
  },
  {
    type: 'beverage',
    name: 'Hot Tea',
    description: 'Hot Tea Description',
    ingredients: [],
    price: 1.33,
    cost: .30,
    ranking: 16,
  },
  {
    type: 'tea',
    name: 'Chai Tea',
    description: 'Chai Tea Description',
    ingredients: [],
    price: 1.33,
    cost: .30,
    ranking: 15,
  },
  {
    type: 'beverage',
    name: 'Italian Soda',
    description: 'Italian Soda Description',
    ingredients: [],
    price: 1.33,
    cost: .30,
    ranking: 15,
  },
  {
    type: 'espresso',
    name: 'Fighting Latte',
    description: 'Fighting Latte Description',
    ingredients: [],
    price: 5.33,
    cost: .70,
    ranking: 1,
  },
  {
    type: 'espresso',
    name: 'Fighting Latte',
    description: 'Fighting Latte Description',
    ingredients: [],
    price: 5.33,
    cost: .70,
    ranking: 1,
  },
  {
    type: 'food',
    name: 'Biscotti',
    description: 'Biscotti Description',
    ingredients: [],
    price: 4.33,
    cost: .10,
    ranking: 1,
  },
]
*/

@Component({
  selector: 'app-business-menu-table',
  templateUrl: './business-menu-table.component.html',
  styleUrls: ['./business-menu-table.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BusinessMenuTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  expandedElement!: MenuItem | null;
  tableBtnColor!: string;
  columns: string[] = ['type', 'name', 'description', 'price', 'cost'];
  @Input() menuItems!: MenuItem[];
  @Output() menuItemsChange = new EventEmitter();
  @Output() notifyParent = new EventEmitter();
  dataSource!: MenuItem[];

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.tableBtnColor = 'primary';
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let change = changes[propName];

        switch (propName) {
          case 'menuItems': {
            console.log({"menuItems":change.currentValue})
            this.dataSource = <MenuItem[]>change.currentValue; 

          }
        }
      }
    }
  }

  deleteMenuItem(menuId: number){
    this.menuService.deleteMenuItem(menuId)
    .subscribe({
      next: data => {
        this.menuService.getMenuItems()
          .subscribe((menuItems: MenuItem[]) => {
            this.dataSource = this.menuItems = menuItems
            this.menuItemsChange.emit(this.menuItems);
            this.notifyParent.emit("menu items changed")
            console.log({"updatedMenuItems":this.menuItems})
          })
      },
      error: error => {
          console.error('There was an error!', error);
      }
  });
  }
  
}
