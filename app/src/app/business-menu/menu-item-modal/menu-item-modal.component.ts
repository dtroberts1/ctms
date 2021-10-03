import { Component, Inject, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Ingredient, MeasurementUnit, MenuItemIngredient } from "src/app/interfaces/ingredient";
import { MenuItem } from "src/app/interfaces/menu-item";
import { IngredientService } from "src/app/services/ingredient-service.service";


type Selectable = {
    selected: boolean,
}

type SelectableMenuItemIngredient = MenuItemIngredient & Selectable;

type ModalInput = {title: string; menuItem: MenuItem} 

@Component({
    selector: 'app-menu-item-modal',
    templateUrl: 'menu-item-modal.component.html',
    styleUrls: ['menu-item-modal.component.less'],
  })
  export class MenuItemModalComponent {
    menuItemIngredients!: SelectableMenuItemIngredient[];
    ingredients!: Ingredient[];
    measurementUnits!: MeasurementUnit[];

    selectedIngredientType !: Ingredient;
    selectedMU !: MeasurementUnit;
    selectedIngredientQty : number = 0;
    isUpdateMode: boolean = false;

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
                this.measurementUnits = result;
            },
            err => {
            }
        )

        this.ingredientsService.getIngredients()
        .subscribe(
            result => {
                this.ingredients = result;
            },
            err => {
            }
        )

        this.ingredientsService.getMenuItemIngredients(this.data.menuItem.id)
            .subscribe(
                result => {
                    this.menuItemIngredients = result as SelectableMenuItemIngredient[];
                },
                err => {
                }
            )
    }

    enableIngredientEditMode(){
        this.ingredientEditMode = true;
        let selectedIngredient = this.menuItemIngredients.find(item => item.selected) as MenuItemIngredient;
        if (this.isUpdateMode && selectedIngredient){
            // Fill Fields with the selected ingredient's defaults
            let existingIngredient = this.ingredients.find(ingred => ingred.ingredientId == selectedIngredient.ingredientId);
            let existingMU = this.measurementUnits.find(mu => mu.measurementUnitId == selectedIngredient.measurementUnitId);
            if (existingIngredient){
                this.selectedIngredientType = existingIngredient as Ingredient;
            }
            if (existingMU){
                this.selectedMU = existingMU as MeasurementUnit;
            }
            this.selectedIngredientQty = selectedIngredient.ingredientQty;
        }
    }

    closeIngredientModifyMenu(canClearAllSelected: boolean){
        this.selectedIngredientType = null as any;
        this.selectedMU = null as any;
        this.selectedIngredientQty = 0;
        this.ingredientEditMode = false;

        if (canClearAllSelected){
            this.menuItemIngredients.forEach(ingred => ingred.selected = false);
            this.isUpdateMode = false;
        }
    }

    selectMenuItemIngredient(menuItemIngred: SelectableMenuItemIngredient){
        let isSelected = menuItemIngred.selected;
        this.menuItemIngredients.forEach(ingred => ingred.selected = false);
        
        if (!isSelected){
            this.isUpdateMode = true;
            menuItemIngred.selected = true;
        }
        else{
            this.isUpdateMode = false;
        }
        this.closeIngredientModifyMenu(false);
    }

    createIngredient(){
        // Save, then call cancel changes
        if (!this.isUpdateMode){
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
                        this.closeIngredientModifyMenu(true);
                    },
                    err => {
                        this.closeIngredientModifyMenu(true);
                    }
                )
        }
        else{
            this.ingredientsService.putMenuItemIngredient({
                menuItemId: this.data.menuItem.id,
                ingredientId: this.selectedIngredientType.ingredientId,
                ingredientName: this.selectedIngredientType.ingredientName,
                measurementUnitId: this.selectedMU.measurementUnitId,
                measurementType: this.selectedMU.name,
                ingredientQty: this.selectedIngredientQty,
            })
                .subscribe(
                    result => {
                        this.closeIngredientModifyMenu(true);
                    },
                    err => {
                        this.closeIngredientModifyMenu(true);
                    }
                )
        }
    }

    plusMinusClicked(isPlus: boolean){

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