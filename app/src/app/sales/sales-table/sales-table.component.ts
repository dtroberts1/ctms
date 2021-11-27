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
import { DatePipe } from '@angular/common'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { StoreService } from 'src/app/services/store-service.service';
import { Store } from 'src/app/interfaces/store';

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

  expandedElement!: Sale | null;
  tableBtnColor!: string;
  panelOpenState = false;
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  myVal!: any;
  rowsSelected: boolean = false;
  mainTableChkbox: boolean = false;
  columnSizeMap: IDictionary = {
    'saleDate': 100,
    'itemSold': 40,
    'salePrice': 7,
    'saleCost': 7,
  }
  columns: string[] = ['checkbox', 'saleDate', 'menuItem', 'store', 'salePrice', 'saleCost', 'expicn'];
  mainColumns: string[] = ['saleDate', 'menuItem', 'store', 'salePrice', 'saleCost'];

  @ViewChild('paginator')
  paginator!: MatPaginator;

  @Input() sales!: Sale[];
  @Input() startDateStr !: string;
  @Input() endDateStr !: string;
  @Output() salesChange = new EventEmitter();
  @Output() notifyParent = new EventEmitter();
  @ContentChildren('text_input')
  saleTextInput!: QueryList<any>;
  @ViewChild(MatSort)
  sort!: MatSort;
  freezeSave : boolean = false;
  availMenuItems!: MenuItem[];
  availStores !: Store[];

  tableReady: boolean = false;
  origSales!: Sale[];
  dataSource!: MatTableDataSource<Sale>;

  constructor(
    private datePipe: DatePipe, 
    private menuService: MenuService, 
    private storeService: StoreService,
    private saleService: SaleService, 
    private toastr: ToastrService, 
    public dialog: MatDialog
    ) { }

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
      this.sales.forEach(item => item.selected = this.mainTableChkbox);
      this.rowsSelected = this.mainTableChkbox;
    }, 0);
  }

  rowSelected(event: any){
    event.stopPropagation();
    setTimeout(()=>{
      this.rowsSelected = this.sales.some(item =>item.selected);
    }, 0);
  }

  menuItemSelectionChanged(event: any, element: any){
    let updatedElement = JSON.parse(JSON.stringify(element));
    updatedElement.menuItemId = element.menuItem.id;
    updatedElement.saleDate = element.saleDate.toISOString().slice(0, 19).replace('T', ' ');
    this.updateItem(updatedElement);
  }

  storeSelectionChanged(event: any, element: any){
    let updatedElement = JSON.parse(JSON.stringify(element));
    updatedElement.storeId = element.store.storeId;
    updatedElement.saleDate = element.saleDate.toISOString().slice(0, 19).replace('T', ' ');
    this.updateItem(updatedElement);
  }

  onKeyDown(event: any, element: Sale){
    if (event.key === "Enter") {
      this.updateItem(element);
    }
  }
  
  onTabKey(event: any, element: Sale, column: string){
    element.isReadOnly = false;
    element.editableColumn = column;
    element.isReadOnly = false;
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
            else{
              sales = [];
              this.updateDataSource(this.sales);
            }
          }
        }
      }
    }
  }

  deleteSale(saleId : number){
    this.saleService.deleteSale(saleId)
      .subscribe(
        result => {
          this.updateLatestMenuItems();
          this.sales.forEach(item => item.selected = false);
          this.rowsSelected = false;
        },
        err => {
          this.rowsSelected = false;
        }
      )
  }


  deleteSales(){
    let selectedIds = this.sales.filter(item => item.selected).map(item => item.saleId);
    this.saleService.deleteSales(selectedIds)
      .subscribe(
        result => {
          this.updateLatestMenuItems();
          this.sales.forEach(item => item.selected = false);
          this.rowsSelected = false;
        },
        err => {
          this.rowsSelected = false;
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
    element.editableColumn = null;
    
      if (!this.freezeSave){
        this.saleService.updateSale(<Sale>element)
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
      }
      this.freezeSave = false;

  }

  updateSaleDate(event: MatDatepickerInputEvent<any,any>, element : any){

    element.saleDate = event.value.toISOString().slice(0, 19).replace('T', ' ');

    this.saleService.updateSale(<Sale>element)
    .pipe(
      map((str: string) => {
        return {data: 'heres data'}
      })
    )
    .subscribe(
      val => {
        this.origSales = JSON.parse(JSON.stringify(this.sales));
        element.saleDate = event.value;
      }
    )
  }

  disableEditMode(event : Event, element : any, column : string, val: any){
    let item = this.origSales.find(item => item.saleId == element.saleId);
    if (item){
      if (item[column] != element[column]){
        let updatedElement = JSON.parse(JSON.stringify(element))
        updatedElement.saleDate = element.saleDate.toISOString().slice(0, 19).replace('T', ' ');
        this.updateItem(updatedElement);
      }
      else{
        element.isReadOnly = true;
        element.editableColumn = null;
      }
    }
  }

  addSale(){
    let newItem : any = {
      saleDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      storeId: 1,
      salePrice: 0.00,
      saleCost: 0.00,
      menuItemId : null,
    }
    this.saleService.addSale(<Sale>newItem)
    .subscribe(
      val => {
        this.updateLatestMenuItems();
      }
    )
    
    this.updateDataSource(this.sales);
  }

  updateLatestMenuItems(){
    this.saleService.getSales(this.startDateStr, this.endDateStr)
    .subscribe((sales: Sale[]) => {
      this.sales = sales;
      this.sales.sort((a,b) => a.name && b.name && a.name.localeCompare(b.name));
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
  
  menuOrDateSelectOpened(event: Event){
    event.stopPropagation();
  }
  updateDataSource(sales: Sale[]){

    this.menuService.getMenuItems()
    .subscribe(
      res => {
        this.availMenuItems = res;
        this.sales.forEach((sale) => {
          if (Array.isArray(this.availMenuItems) && this.availMenuItems.length){
            sale.menuItem = this.availMenuItems.find(item => item.id === sale.menuItemId);
          }
        });
      },
      err => {

      }
    )

    this.storeService.getStores()
      .subscribe(
        res => {
          this.availStores = res;
          this.sales.forEach((sale) => {
            if (Array.isArray(this.availStores) && this.availStores.length){
              sale.store = this.availStores.find(item => item.storeId === sale.storeId);
            }
          });        },
        err => {

        }
      )

    this.tableReady = false;
    this.dataSource = new MatTableDataSource<Sale>(sales);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.tableReady = true;
    if (Array.isArray(sales) && sales.length){
      this.origSales = JSON.parse(JSON.stringify(sales));
    }
  }

  deleteMenuItem(menuId: number){
    this.menuService.deleteMenuItem(menuId)
    .subscribe({
      next: data => {
        this.saleService.getSales(this.startDateStr, this.endDateStr)
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
        if (a[event.active].recipeInstructions !== undefined){
          return a[event.active].name.toUpperCase().localeCompare(b[event.active].name.toUpperCase(), 'en');
        }
        else if (a[event.active] instanceof Date){
          return a[event.active].getTime() < b[event.active].getTime();
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
