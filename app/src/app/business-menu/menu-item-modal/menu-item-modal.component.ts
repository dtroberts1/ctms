import { Component, Inject, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Ingredient, MeasurementUnit, MenuItemIngredient } from "src/app/interfaces/ingredient";
import { MenuItem } from "src/app/interfaces/menu-item";
import { IngredientService } from "src/app/services/ingredient-service.service";

type ModalInput = {title: string; menuItem: MenuItem} 

@Component({
    selector: 'app-menu-item-modal',
    templateUrl: 'menu-item-modal.component.html',
    styleUrls: ['menu-item-modal.component.less'],
  })
  export class MenuItemModalComponent {
    menuItemIngredients!: MenuItemIngredient[];
    ingredients!: Ingredient[];
    measurementUnits!: MeasurementUnit[];

    selectedIngredientType !: Ingredient;
    selectedMU !: MeasurementUnit;
    selectedIngredientQty : number = 0;

    ingredientEditMode: boolean = false;
    constructor(
      public dialogRef: MatDialogRef<MenuItemModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ModalInput,
      private ingredientsService: IngredientService,
      ) {}

    ngOnInit(){
        this.ingredientsService.getMeasurementUnits()
        .subscribe(
            result => {
                console.log({"measurementUnits":result})
                this.measurementUnits = result;
            },
            err => {
                console.log({"err":err})
            }
        )

        this.ingredientsService.getIngredients()
        .subscribe(
            result => {
                console.log({"ingred":result})
                this.ingredients = result;
            },
            err => {
                console.log({"err":err})
            }
        )

        this.ingredientsService.getMenuItemIngredients(this.data.menuItem.id)
            .subscribe(
                result => {
                    console.log({"result":result})
                    this.menuItemIngredients = result;
                },
                err => {
                    console.log({"err":err})
                }
            )
    }

    enableIngredientEditMode(){
        this.ingredientEditMode = true;
    }

    closeIngredientModifyMenu(){
        this.selectedIngredientType = null as any;
        this.selectedMU = null as any;
        this.selectedIngredientQty = 0;
        this.ingredientEditMode = false;
    }

    createIngredient(){
        // Save, then call cancel changes
        this.ingredientsService.postMenuItemIngredient({
            menuItemId: this.data.menuItem.id,
            ingredientId: this.selectedIngredientType.ingredientId,
            ingredientName: this.selectedIngredientType.ingredientName,
            measurementUnitId: this.selectedMU.measurementUnitId,
            measurementType: this.selectedMU.name,
            ingredientQty: this.selectedIngredientQty,
        })
            .subscribe(
                result => {
                    console.log({"saveResult":result})
                    this.closeIngredientModifyMenu();
                },
                err => {
                    console.log({"saveError":err})
                    this.closeIngredientModifyMenu();
                }
            )
    }

    plusMinusClicked(isPlus: boolean){
        console.log("plus or minus clicked")

        if (isNaN(this.selectedIngredientQty) || this.selectedIngredientQty < 0){
            this.selectedIngredientQty = 0;
        }
        else{
            if (isPlus){
                this.selectedIngredientQty++;
            }
            else{
                if (this.selectedIngredientQty > 0){
                    this.selectedIngredientQty--;
                }
            }
        }
    }
  
    close(): void {
      this.dialogRef.close();   
    }
  
  }