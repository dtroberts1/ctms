import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ingredient, IngredientType } from 'src/app/interfaces/ingredient';
import { Store, StoreIngredient } from 'src/app/interfaces/store';
import { IngredientService } from 'src/app/services/ingredient-service.service';
type ModalInput = {storeId: number, storeIngredients: Array<StoreIngredient>};
const pal = ["#001464", "#26377B", "#404F8B", "#59709A"]

@Component({
  selector: 'app-add-inventory-modal',
  templateUrl: './add-inventory-modal.component.html',
  styleUrls: ['./add-inventory-modal.component.less']
})
export class AddInventoryModalComponent implements OnInit {
  storeIngredients!: Array<StoreIngredient> | any;
  origStoreIngredients!: Array<StoreIngredient> | any;
  ingredientTypes!: Array<IngredientType>;
  selectedIngredientType!: IngredientType;
  nonFilteredIngredients!: Array<Ingredient>;
  ingredients!: Array<Ingredient>;
  displayableIngredients!: Array<Ingredient>;
  selectedIngredient!: Ingredient;
  selectedExistingIngredient!: StoreIngredient;
  selectedIngredientQty: number = 0;
  selectedExistIngredientQty: number = 0;
  isAddOrEditMode: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalInput,
    public dialogRef: MatDialogRef<AddInventoryModalComponent>,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit(): void {
    this.ingredientService.getIngredientTypes()
      .subscribe(
        res => {
          console.log({"res":res});
          this.ingredientTypes = res;
        },
        err => {

        },
      );

      this.ingredientService.getIngredients()
      .subscribe(
          result => {
              this.nonFilteredIngredients = result;
              this.ingredients = result;              
              this.displayableIngredients = this.ingredients.filter(ingredType => !(this.storeIngredients && this.storeIngredients
                  .map((ingred: StoreIngredient) => ingred.ingredientId)
                  .some((ingredId: number) => {return ingredId == ingredType.ingredientId})));
          },
          err => {
          }
      );

      console.log({"data":this.data});
      this.storeIngredients = this.data.storeIngredients;
      this.origStoreIngredients = JSON.parse(JSON.stringify(this.storeIngredients));
      let i = 0;
      this.storeIngredients.forEach((item : any) => {
        item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
        i++;
      });
  }

  removeIngredient(){
    this.ingredientService.deleteStoreIngredient(this.data.storeId, this.selectedExistingIngredient.ingredientId)
      .subscribe(
        res => {
          this.refreshStoreIngredients();
        },
        err => {

        },
      )
  }

  cancelExistingChanges(){
    this.isAddOrEditMode = false;

    this.refreshStoreIngredients();
  }

  addStoreIngredient(){
    let selectedCategory = this.selectedIngredientType;

    this.ingredientService.postStoreIngredient({
      weightInOz: this.selectedIngredientQty,
      ingredientId: this.selectedIngredient.ingredientId,
      storeId: this.data.storeId,
      mL: -1, /*milliliters*/ 
      ingredientName: "",
      density: -1, /* g/ml */
      muName: "oz",
      muQty: this.selectedIngredientQty,
      estCostPerOz: -1,
    })
      .subscribe(
        res => {
          this.refreshStoreIngredients()
            .then(() => {
              this.selectedIngredientType = selectedCategory;
              this.ingredientCategorySelected();
            });
        },
        err => {

        }
      );
  }

  refreshStoreIngredients(){

    return new Promise((resolve, reject) => {
      this.ingredientService.getStoreIngredients(this.data.storeId)
      .subscribe(
        storeIngredRes => {
          this.storeIngredients = Array.isArray(storeIngredRes) ? storeIngredRes : [];
          this.origStoreIngredients = JSON.parse(JSON.stringify(this.storeIngredients));
          console.log({"data":this.data});
          let i = 0;
          this.storeIngredients.forEach((item : any) => {
            item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
            i++;
          });
  
          this.storeIngredients.sort((a: StoreIngredient,b: StoreIngredient) => a.ingredientName.localeCompare(b.ingredientName));
  
          this.ingredientService.getIngredients()
          .subscribe(
              result => {
                this.nonFilteredIngredients = result;
                this.ingredients = result;              
                this.displayableIngredients = this.ingredients.filter(ingredType => !(this.storeIngredients && this.storeIngredients
                    .map((ingred: StoreIngredient) => ingred.ingredientId)
                    .some((ingredId: number) => {return ingredId == ingredType.ingredientId})));
                resolve(true);
              },
              err => {
                resolve(true);
              }
          );
        },
        err => {
          resolve(true);
        }
      );
  
      this.selectedExistIngredientQty = 0;
      this.selectedExistingIngredient = null as any;
    });

  }

  selectRow(storeIngredient: StoreIngredient){
    
    let origSelected = this.storeIngredients.find((item: any) => {return item.isSelected});

    let isSelected = (storeIngredient as any).isSelected;
    this.storeIngredients.forEach((item: any) => item.isSelected = false);
    let index = this.storeIngredients.findIndex((item: StoreIngredient) => item.ingredientId === storeIngredient.ingredientId);

    if (!isSelected){
      console.log(" in a")
      // If not selected
      if (origSelected && origSelected.ingredientId != storeIngredient.ingredientId){
        console.log(" in b")

        // If selecting a different one from the originally selected row, and changes exist, save the original
        let origIngred = this.origStoreIngredients.find((ingred: Ingredient) => ingred.ingredientId);
        if (origIngred && (origSelected as StoreIngredient).weightInOz != (origIngred as StoreIngredient).weightInOz){
          console.log(" in c")

          this.ingredientService.putStoreIngredient({
            weightInOz: this.selectedExistIngredientQty,
            ingredientId: origSelected.ingredientId,
            storeId: this.data.storeId,
            mL: -1, /*milliliters*/ 
            ingredientName: "",
            density: -1, /* g/ml */
            muName: "oz",
            muQty: this.selectedExistIngredientQty,
            estCostPerOz: -1,
          })
            .subscribe(
              res => {

              },
              err => {
      
              },
            )
        }
      }


      this.storeIngredients[index].isSelected = true;
      this.selectedExistingIngredient = this.storeIngredients[index];
      this.selectedExistIngredientQty = Math.round(this.selectedExistingIngredient.weightInOz * 100) / 100;
    }
    else{
      this.storeIngredients[index].isSelected = false;
      this.selectedExistingIngredient = null as any;
      this.selectedExistIngredientQty = 0;
    }
  }

  updateIngredient(){
    this.storeIngredients.forEach((item: any) => item.isSelected = false);

    this.ingredientService.putStoreIngredient({
      weightInOz: this.selectedExistIngredientQty,
      ingredientId: this.selectedExistingIngredient.ingredientId,
      storeId: this.data.storeId,
      mL: -1, /*milliliters*/ 
      ingredientName: "",
      density: -1, /* g/ml */
      muName: "oz",
      muQty: this.selectedExistIngredientQty,
      estCostPerOz: -1,
    })
      .subscribe(
        res => {
          this.refreshStoreIngredients();
        },
        err => {
        },
      )
  }

  selectedIngredientChanged(){

  }
  
  ingredientCategorySelected(){
    this.ingredients = this.nonFilteredIngredients
        .filter(ingred => ingred.ingredientTypeId == this.selectedIngredientType.ingredientTypeId);  

    if (!this.ingredients.some(ingred => this.selectedIngredient && ingred.ingredientId == this.selectedIngredient.ingredientId)){
        this.selectedIngredient = null as any;
    }
                    
    this.displayableIngredients = this.ingredients
        .filter(ingredType => !(this.storeIngredients && this.storeIngredients
        .map((ingred: Ingredient) => ingred.ingredientId)
        .some((ingredId: number) => ingredId == ingredType.ingredientId)));
  }

  plusMinusClicked(isPlus: boolean){

    if (isNaN(this.selectedIngredientQty) || this.selectedIngredientQty < 0){
        this.selectedIngredientQty = 0;
    }
    else{
        if (isPlus){
            this.selectedIngredientQty += .01;
        }
        else{
            if (this.selectedIngredientQty > 0){
                this.selectedIngredientQty -= .01;
            }
        }
    }
    this.selectedIngredientQty = Math.round(this.selectedIngredientQty * 100) / 100
  }

  plusMinusExistingClicked(isPlus: boolean){

    if (isNaN(this.selectedExistIngredientQty) || this.selectedExistIngredientQty < 0){
        this.selectedExistIngredientQty = 0;
    }
    else{
        if (isPlus){
            this.selectedExistIngredientQty += .01;
        }
        else{
            if (this.selectedExistIngredientQty > 0){
                this.selectedExistIngredientQty -= .01;
            }
        }
    }
    this.selectedExistIngredientQty = Math.round(this.selectedExistIngredientQty * 100) / 100
    this.selectedExistingIngredient.weightInOz = this.selectedExistIngredientQty;
  }

  ingredientQtChanged(){
    if (!isNaN(this.selectedExistIngredientQty) || this.selectedExistIngredientQty < 0){
      this.selectedExistIngredientQty = Math.round(this.selectedExistIngredientQty * 100) / 100
      this.selectedExistingIngredient.weightInOz = this.selectedExistIngredientQty; 
    }
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
