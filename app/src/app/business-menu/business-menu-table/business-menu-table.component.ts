import { Component, ContentChildren, EventEmitter, Inject, Input, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MenuItem } from '../../interfaces/menu-item';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MenuService } from '../menu-service.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MenuItemModalComponent } from '../menu-item-modal/menu-item-modal.component';
import { MatTableDataSource } from '@angular/material/table';

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
  @ViewChild('paginator')
  paginator!: MatPaginator;

  @Input() menuItems!: MenuItem[];
  @Output() menuItemsChange = new EventEmitter();
  @Output() notifyParent = new EventEmitter();
  @ContentChildren('text_input')
  menuItemTextInput!: QueryList<any>;
  tableReady: boolean = false;

  dataSource!: MatTableDataSource<MenuItem>;

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
              menuItems.forEach((item) => {item.isReadOnly = true;});
              console.log("on changes..")
              this.updateDataSource(this.menuItems);
            }
          }
        }
      }
    }
  }

  deleteIconClicked(event : any, menuItem: MenuItem, col: any){
    event.stopPropagation();
  }

  openDialog(menuItem: MenuItem): void {
    const dialogRef = this.dialog.open(MenuItemModalComponent, {
      width: '550px',
      height: '540px',
      data: {
        title: `Recipe: ${menuItem.name}`,
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

  disableEditMode(event : Event, element : any, column : string, val: any){
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

  addMenuItem(){
    let newItem : MenuItem = {
      type: 'Test',
      description: 'Test',
      name: 'Test',
      price: 0.00,
      cost: 0.00,
      ranking: 0,  
      averageReviewRating: 0,
      qtySold: 0,
      popularity: 0,
      reviewRank: 0,
      recipeInstructions: '',
      id: -1,
    }
    this.menuItems.splice(0, 0, newItem);
    console.log({"menuItems":this.menuItems})
    this.updateDataSource(this.menuItems);
  }

  editIconClicked(event : any, row: any, col: any){
    event.stopPropagation()
    let evt = JSON.parse(JSON.stringify(event))
    row.isReadOnly = false;
    row.editableColumn = col;
    let colIndex = this.columns.findIndex(column => column === col);
    let rowIndex = this.menuItems.findIndex(rowItem => rowItem.id == row.id);
    console.log("Row index is  " + rowIndex)
    console.log("this.dataSource.paginator.pageSize is " + (this.dataSource.paginator ? this.dataSource.paginator.pageSize : 0))
    console.log({"dataSource":this.dataSource})

    const arr = this.menuItemTextInput.toArray();
    if (this.dataSource.paginator){
      let index = (colIndex * (this.dataSource.paginator ? this.menuItems.length / this.dataSource.paginator.pageSize : 0)) + (rowIndex % this.dataSource.paginator.pageSize);
      console.log("index is  " + index);
      console.log({"arr":arr})
      if (arr[index] && arr[index].nativeElement){
        arr[index].nativeElement.children[0].children[0].children[0].focus();
      }
      else{
        console.log("unable to access at index " + index)
      }
    }

    
  }

  updateDataSource(menuItems: MenuItem[]){
    this.tableReady = false;
    this.dataSource = new MatTableDataSource<MenuItem>();
    this.dataSource.data = menuItems;
    this.dataSource.paginator = this.paginator;
    this.tableReady = true;
  }

  deleteMenuItem(menuId: number){
    this.menuService.deleteMenuItem(menuId)
    .subscribe({
      next: data => {
        this.menuService.getMenuItems()
          .subscribe((menuItems: MenuItem[]) => {
            this.menuItems = menuItems;
            this.updateDataSource(this.menuItems);
            this.menuItemsChange.emit(this.menuItems);
            this.notifyParent.emit("menu items changed")
          })
      },
      error: error => {
      }
  });
  }
  
}
