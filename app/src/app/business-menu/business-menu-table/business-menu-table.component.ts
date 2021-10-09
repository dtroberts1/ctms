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
  rowsSelected: boolean = false;
  mainTableChkbox: boolean = false;
  columnSizeMap: IDictionary = {
    'type': 50,
    'name': 40,
    'description': 260,
    'price': 7,
    'cost': 7,
  }
  columns: string[] = ['checkbox', 'type', 'name', 'description', 'price', 'cost'];
  mainColumns: string[] = ['type', 'name', 'description', 'price', 'cost'];

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

  selectDeselectAllRows(){
    setTimeout(() => {
      this.menuItems.forEach(item => item.selected = this.mainTableChkbox);
    }, 0);
  }

  rowSelected(event: any){
    event.stopPropagation();
    setTimeout(()=>{
      this.rowsSelected = this.menuItems.some(item =>item.selected);
    }, 0);


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
              this.updateDataSource(this.menuItems);
            }
          }
        }
      }
    }
  }

  deleteMenuItems(){
    let selectedIds = this.menuItems.filter(item => item.selected).map(item => item.id);
    this.menuService.deleteMenuItems(selectedIds)
      .subscribe(
        result => {
          this.updateLatestMenuItems();
          this.menuItems.forEach(item => item.selected = false);
        },
        err => {
        }
      )
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
      type: '____',
      description: '____',
      name: '____',
      price: 0,
      cost: 0,
      averageReviewRating: 0,
      qtySold: 0,
      popularity: 0,
      reviewRank: 0,
      recipeInstructions: '',
    }
    this.menuService.addMenuItem(<MenuItem>newItem)
    .subscribe(
      val => {
        this.updateLatestMenuItems();
      }
    )
    this.updateDataSource(this.menuItems);
  }

  updateLatestMenuItems(){
    this.menuService.getMenuItems()
    .subscribe((menuItems: MenuItem[]) => {
      this.menuItems = menuItems;
      this.menuItems.sort((a,b) => a.name.localeCompare(b.name));
      this.updateDataSource(this.menuItems);
      this.menuItemsChange.emit(this.menuItems);
      this.notifyParent.emit("menu items changed")
    });
  }

  editIconClicked(event : any, row: any, col: any){
    event.stopPropagation()
    let evt = JSON.parse(JSON.stringify(event))
    row.isReadOnly = false;
    row.editableColumn = col;
    let colIndex = this.columns.findIndex(column => column === col);
    let rowIndex = this.menuItems.findIndex(rowItem => rowItem.id == row.id);

    const arr = this.menuItemTextInput.toArray();
    if (this.dataSource.paginator){
      let index = (colIndex * (this.dataSource.paginator ? this.menuItems.length / this.dataSource.paginator.pageSize : 0)) + (rowIndex % this.dataSource.paginator.pageSize);
      if (arr[index] && arr[index].nativeElement){
        arr[index].nativeElement.children[0].children[0].children[0].focus();
      }
      else{
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
