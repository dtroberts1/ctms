import { Component, EventEmitter, Inject, Input, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MenuItem } from '../../interfaces/menu-item';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MenuService } from '../menu-service.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MenuItemModalComponent } from '../menu-item-modal/menu-item-modal.component';

interface IDictionary {
  [index: string]: number;
}

type MenuItemKeys = keyof 'type' | 'name' | 'description' | 'price' | 'cost'


interface IDictionaryMenuItem {
  [index: string]: MenuItem;
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
    trigger('openClose', [
      // ...
      state('open', style({
        transform: 'rotate(0deg)'
      })),
      state('closed', style({
        transform: 'rotate(-180deg)'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('1s')
      ]),
    ]),
  ],
})
export class BusinessMenuTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  expandedElement!: MenuItem | null;
  tableBtnColor!: string;
  panelOpenState = false;
  myVal!: any;
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

  constructor(private menuService: MenuService, private toastr: ToastrService, public dialog: MatDialog) { }

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

  openDialog(menuItem: MenuItem): void {
    const dialogRef = this.dialog.open(MenuItemModalComponent, {
      width: '550px',
      height: '520px',
      data: {
        title: `Edit: ${menuItem.name}`,
        menuItem: menuItem,
      },
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  setProp<T, K extends keyof T>(obj: T, key: K, val: any) {
    obj[key] = val;
  }

  disableEditMode(element : any, column : string, val: any){
    element.isReadOnly = true;
    element.editableColumn = null;

    // Save Row
    this.menuService.updateMenuItem(<MenuItem>element)
      .pipe(
        map((str: string) => {
          return {data: 'heres data'}
        })
      )
      .subscribe(
        val => {
        }
      )
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
