import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';
import { Store, StoreIngredient } from '../interfaces/store';
import { IngredientService } from '../services/ingredient-service.service';
import { StoreService } from '../services/store-service.service';
import { AddInventoryModalComponent } from './add-inventory-modal/add-inventory-modal.component';
import { SimulatorComponent } from './simulator/simulator.component';

const pal = ["#001464", "#26377B", "#404F8B", "#59709A"]

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.less']
})
export class StoresComponent implements OnInit {

  store!: Store;
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
        storeId: this.store.storeId,
        storeIngredients: JSON.parse(JSON.stringify(this.storeIngredients)),
      },
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(
      res => {
        this.ingredientService.getStoreIngredients(this.store.storeId)
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
        storeId: this.store.storeId,
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
        }
        else{
          this.stores = [];
        }
      },
      err => {

      }
    );
  }
  storeChanged(event : any, store: Store){
    if (store){
      this.ingredientService.getStoreIngredients(store.storeId)
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
