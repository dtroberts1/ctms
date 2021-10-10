import { Component, ContentChildren, EventEmitter, Inject, Input, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MenuItem } from '../../interfaces/menu-item';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MenuService } from '../../business-menu/menu-service.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MenuItemModalComponent } from '../../business-menu/menu-item-modal/menu-item-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Sale } from 'src/app/interfaces/sale';
import { SaleService } from 'src/app/services/sale-service.service';

interface IDictionary {
  [index: string]: number;
}

@Component({
  selector: 'app-sales-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.less'],
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
export class SalesTableComponent implements OnInit {
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
  columns: string[] = ['checkbox', 'saleDate', 'itemSold', 'salePrice', 'saleCost'];
  mainColumns: string[] = ['saleDate', 'itemSold', 'salePrice', 'saleCost'];

  @ViewChild('paginator')
  paginator!: MatPaginator;

  @Input() sales!: Sale[];

  @Output() salesChange = new EventEmitter();
  @Output() notifyParent = new EventEmitter();
  @ContentChildren('text_input')
  saleTextInput!: QueryList<any>;
  @ViewChild(MatSort)
  sort!: MatSort;
  freezeSave : boolean = false;

  tableReady: boolean = false;
  origSales!: Sale[];
  dataSource!: MatTableDataSource<Sale>;

  constructor(private menuService: MenuService, private saleService: SaleService, private toastr: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.tableBtnColor = 'primary';
    let str = 'title';
    this.dataSource = new MatTableDataSource<Sale>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getColumnName(fieldName: string){
    const result = fieldName.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  selectDeselectAllRows(){
    setTimeout(() => {
      //this.sales.forEach(item => item.selected = this.mainTableChkbox);
    }, 0);
  }

  rowSelected(event: any){
    event.stopPropagation();
    setTimeout(()=>{
      //this.rowsSelected = this.menuItems.some(item =>item.selected);
    }, 0);
  }

  onKeyDown(event: any, element: MenuItem){
    if (event.key === "Enter") {
      //this.updateItem(element);
    }
  }
  
  onTabKey(event: any, element: MenuItem, column: string){
    /*
    element.isReadOnly = false;
    element.editableColumn = column;
    element.isReadOnly = false;
    */
  }

  applyFilter(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let change = changes[propName];

        switch (propName) {
          case 'sales': {
            let sales = change.currentValue;
            if (Array.isArray(sales) && sales.length){
              sales.forEach((item) => {item.isReadOnly = true;});
              this.updateDataSource(this.sales);
            }
          }
        }
      }
    }
  }

  deleteMenuItems(){
    let selectedIds = this.sales.filter(item => item.selected).map(item => item.saleId);
    this.menuService.deleteMenuItems(selectedIds)
      .subscribe(
        result => {
          this.updateLatestMenuItems();
          this.sales.forEach(item => item.selected = false);
        },
        err => {
        }
      )
  }

  deleteIconClicked(event : any, sale: Sale, col: any){
    event.stopPropagation();
    this.freezeSave = true;

    let origSale = this.origSales.find(item => item.saleId === sale.saleId);
    let origData = this.dataSource.data.find(item => item.saleId == sale.saleId);

    if (origSale){
      sale[col] = origSale[col];
    }
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

  updateItem(element: Sale){
    element.isReadOnly = true;
    element.editableColumn = null;    // Save Row

    if (!this.freezeSave){
      /*
    this.menuService.updateMenuItem(<Sale>element)
      .pipe(
        map((str: string) => {
          return {data: 'heres data'}
        })
      )
      .subscribe(
        val => {
          this.origSales = JSON.parse(JSON.stringify(this.sales));
        }
      )
      */
    }
    this.freezeSave = false;
  }

  disableEditMode(event : Event, element : any, column : string, val: any){
    let item = this.origSales.find(item => item.saleId == element.saleId);
    if (item){
      if (item[column] != element[column]){
        this.updateItem(element);
      }
      else{
        element.isReadOnly = true;
        element.editableColumn = null;    // Save Row
      }
    }
  }

  addMenuItem(){
    /*
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
    this.menuService.addMenuItem(<Sale>newItem)
    .subscribe(
      val => {
        this.updateLatestMenuItems();
      }
    )
    
    this.updateDataSource(this.sales);
    */
  }

  updateLatestMenuItems(){
    this.saleService.getSales()
    .subscribe((sales: Sale[]) => {
      this.sales = sales;
      this.sales.sort((a,b) => a.name.localeCompare(b.name));
      this.updateDataSource(this.sales);
      this.salesChange.emit(this.sales);
      this.notifyParent.emit("menu items changed")
    });
  }

  editIconClicked(event : any, row: any, col: any){
    //event.stopPropagation()
    let evt = JSON.parse(JSON.stringify(event))
    row.isReadOnly = false;
    row.editableColumn = col;
    let colIndex = this.columns.findIndex(column => column === col);
    let rowIndex = this.sales.findIndex(rowItem => rowItem.saleId == row.saleId);

    const arr = this.saleTextInput.toArray();
    if (this.dataSource.paginator){
      let index = (colIndex * (this.dataSource.paginator ? this.sales.length / this.dataSource.paginator.pageSize : 0)) + (rowIndex % this.dataSource.paginator.pageSize);
      if (arr[index] && arr[index].nativeElement){
        arr[index].nativeElement.children[0].children[0].children[0].focus();
      }
      else{
      }
    }

    
  }

  updateDataSource(sales: Sale[]){
    this.tableReady = false;
    this.dataSource = new MatTableDataSource<Sale>(sales);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.tableReady = true;
    this.origSales = JSON.parse(JSON.stringify(sales));
  }

  deleteMenuItem(menuId: number){
    this.menuService.deleteMenuItem(menuId)
    .subscribe({
      next: data => {
        this.saleService.getSales()
          .subscribe((sales: Sale[]) => {
            this.sales = sales;
            this.updateDataSource(this.sales);
            this.salesChange.emit(this.sales);
            this.notifyParent.emit("menu items changed")
          })
      },
      error: error => {
      }
  });
  }

  onMatSortChange(event: any){
    this.sales.sort((a,b) => {
      if (a[event.active] && b[event.active]){
        if (typeof a[event.active] == 'number'){
          return a[event.active] - b[event.active];
        }
        else{
          return a[event.active].toUpperCase().localeCompare(b[event.active].toUpperCase(), 'en');
        }
      }
      else if(!a[event.active] && b[event.active]){
        return -1;
      }
      else if(a[event.active] && !b[event.active]){
        return 1;
      }
      else{
        return -1;
      }
    });
    if (event.direction === 'desc'){
      this.sales.reverse();
    }
    this.updateDataSource(this.sales);
  }
  
}
