import { Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MenuItem } from '../../interfaces/menu-item';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MenuService } from '../menu-service.service';
interface IDictionary {
  [index: string]: number;
}

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
  columnSizeMap: IDictionary = {
    'type': 50,
    'name': 40,
    'description': 260,
    'price': 7,
    'cost': 7,
  }
  columns: string[] = ['type', 'name', 'description', 'price', 'cost'];
  @Input() menuItems!: MenuItem[];
  @Output() menuItemsChange = new EventEmitter();
  @Output() notifyParent = new EventEmitter();
  @ViewChildren('text_input')
  menuItemTextInput!: QueryList<any>;

  dataSource!: MenuItem[];

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.tableBtnColor = 'primary';
    let str = 'title';

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let change = changes[propName];

        switch (propName) {
          case 'menuItems': {
            let menuItems = change.currentValue;
            if (Array.isArray(menuItems) && menuItems.length){
              menuItems.forEach((item) => {item.isReadOnly = true;})
              this.dataSource = <MenuItem[]>menuItems; 
            }
          }
        }
      }
    }
  }

  disableEditMode(element : any, column : any){
    element.isReadOnly = true;
    element.editableColumn = null;

    // Save Row
  }

  editIconClicked(event : any, row: any, col: any){
    event.stopPropagation()
    let evt = JSON.parse(JSON.stringify(event))
    row.isReadOnly = false;
    row.editableColumn = col;
    let colIndex = this.columns.findIndex(column => column === col);
    let rowIndex = this.menuItems.findIndex(rowItem => rowItem.id == row.id);
    const arr = this.menuItemTextInput.toArray();
    let index = (colIndex * (this.menuItems.length)) + rowIndex;
    arr[index].nativeElement.children[0].children[0].children[0].focus();

    
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
          })
      },
      error: error => {
          console.error('There was an error!', error);
      }
  });
  }
  
}
