import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, StoreIngredient } from '../interfaces/store';
import { IngredientService } from '../services/ingredient-service.service';
import { StoreService } from '../services/store-service.service';
import { AddInventoryModalComponent } from './add-inventory-modal/add-inventory-modal.component';
import { AddStoreModalComponent } from './add-store-modal/add-store-modal.component';
import { SimulatorComponent } from './simulator/simulator.component';

const pal = ["#001464", "#26377B", "#404F8B", "#59709A"]

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.less']
})
export class StoresComponent implements OnInit {

  store!: Store | null;
  stores!: Array<Store>;
  storeIngredients!: Array<StoreIngredient> | any;

  constructor(
    private storeService: StoreService,
    private ingredientService: IngredientService,
    public dialog: MatDialog
  ) { 

  }

  item = this;

  setupForecastChart(){

  }

  openAddInventoryModal(){
    const dialogRef = this.dialog.open(AddInventoryModalComponent, {
      width: '550px',
      height: '640px',
      data: {
        storeId: (this.store && this.store.storeId) ?? -1,
        storeIngredients: JSON.parse(JSON.stringify(this.storeIngredients)),
      },
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(
      res => {
        this.ingredientService.getStoreIngredients((this.store && this.store.storeId) ?? -1)
        .subscribe(
          res => {
            this.storeIngredients = res;
            let i = 0;
            this.storeIngredients.forEach((item : any) => {
              item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
              i++;
            });
          },
          err => {

          }
        );
      },
      err => {

      }
    )
  }

  openSimModal(){

    const dialogRef = this.dialog.open(SimulatorComponent, {
      width: '550px',
      height: '640px',
      data: {
        storeId: (this.store && this.store.storeId) ?? -1,
        storeIngredients: JSON.parse(JSON.stringify(this.storeIngredients)),
      },
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit(): void {
    this.storeService.getStores()
    .subscribe(
      res => {
        if (Array.isArray(res)){
          this.stores = res;

          this.store = this.stores[0];
          this.storeChanged(null, this.store);
        }
        else{
          this.stores = [];
        }
      },
      err => {

      }
    );
  }

  deleteStore(){
    this.storeService.deleteStore((this.store && this.store.storeId) ?? -1)
      .subscribe((res) => {
        this.getStores();
      },
      err => {
        this.getStores();
      }
      
      );
  }

  getStores(){
    this.storeService.getStores()
    .subscribe(
      res => {
        console.log({"stores":res})
        if (Array.isArray(res)){
          let prevStoreId = (this.store && this.store.storeId) ?? -1;
          this.stores = res;
          let store = this.stores.find(store => store.storeId === prevStoreId);
          if (store){
            this.store = store;
          }
          else{
            this.store = null;
          }
          this.storeChanged(null, this.store);
        }
        else{
          this.stores = [];
        }
      },
      err => {

      }
    );
  }

  addStore(){
    const dialogRef = this.dialog.open(AddStoreModalComponent, {
      width: '550px',
      height: '640px',
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.getStores();
      }
    });
  }

  storeChanged(event : any, store: Store | null){
    if (store){
      this.ingredientService.getStoreIngredients(store.storeId ?? -1)
        .subscribe(
          res => {
            this.storeIngredients = res;
            let i = 0;
            this.storeIngredients.forEach((item : any) => {
              item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
              i++;
            });
          },
          err => {

          }
        );
    }
  }

  getColors(length: number, pallet: string[]){
    let colors = [];

    for(let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }
}
