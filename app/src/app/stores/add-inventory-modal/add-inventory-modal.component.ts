import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreIngredient } from 'src/app/interfaces/store';
type ModalInput = {storeId: number, storeIngredients: Array<StoreIngredient>};
const pal = ["#001464", "#26377B", "#404F8B", "#59709A"]

@Component({
  selector: 'app-add-inventory-modal',
  templateUrl: './add-inventory-modal.component.html',
  styleUrls: ['./add-inventory-modal.component.less']
})
export class AddInventoryModalComponent implements OnInit {
  storeIngredients!: Array<StoreIngredient> | any;;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalInput,
    public dialogRef: MatDialogRef<AddInventoryModalComponent>,

  ) { }

  ngOnInit(): void {
    console.log({"data":this.data});
    this.storeIngredients = this.data.storeIngredients;
    let i = 0;
    this.storeIngredients.forEach((item : any) => {
      item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
      i++;
    });
  }

  enableAddInventoryMode(){
  }

  close(){
    this.dialogRef.close();   
  }
  getColors(length: number, pallet: string[]){
    let colors = [];

    for(let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }
}
