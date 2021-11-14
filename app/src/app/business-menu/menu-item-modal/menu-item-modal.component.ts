import { nullSafeIsEquivalent, THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, Inject, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Ingredient, IngredientType, MeasurementUnit, MenuItemIngredient } from "src/app/interfaces/ingredient";
import { MenuItem } from "src/app/interfaces/menu-item";
import { IngredientService } from "src/app/services/ingredient-service.service";
import { MenuService } from "../menu-service.service";


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
    nonFilteredIngredients !: Ingredient[];
    ingredientTypes !: IngredientType[];
    displayableIngredients!: Ingredient[];
    selectedIngredientInvalid: boolean = false;
    selectedMUInvalid: boolean = false;
    measurementUnits!: MeasurementUnit[];
    selectedIngredientType !: IngredientType;
    selectedIngredient !: Ingredient;
    selectedMU !: MeasurementUnit;
    selectedIngredientQty : number = 0;
    isUpdateMode: boolean = false;
    originalInstructions: string = '';
    isEditInstructionsMode: boolean = false;

    ingredientEditMode: boolean = false;
    constructor(
      public dialogRef: MatDialogRef<MenuItemModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ModalInput,
      private ingredientsService: IngredientService,
      private menuService: MenuService,
      ) {}

    ngOnInit(){
        this.originalInstructions = this.data.menuItem.recipeInstructions;
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
                this.nonFilteredIngredients = result;
                this.ingredients = result;              
                this.displayableIngredients = this.ingredients.filter(ingredType => !(this.menuItemIngredients && this.menuItemIngredients
                    .map(ingred => ingred.ingredientId)
                    .some(ingredId => ingredId == ingredType.ingredientId)));
            },
            err => {
            }
        );

        this.ingredientsService.getIngredientTypes()
        .subscribe(
            result => {
                this.ingredientTypes = result;
            },
            err => {
            }
        )

        this.getMenuItemIngredients();
    }

    ingredientCategorySelected(){
        this.ingredients = this.nonFilteredIngredients
            .filter(ingred => ingred.ingredientTypeId == this.selectedIngredientType.ingredientTypeId);  

        if (!this.ingredients.some(ingred => this.selectedIngredient && ingred.ingredientId == this.selectedIngredient.ingredientId)){
            this.selectedIngredient = null as any;
        }
                        
        this.displayableIngredients = this.ingredients
            .filter(ingredType => !(this.menuItemIngredients && this.menuItemIngredients
            .map(ingred => ingred.ingredientId)
            .some(ingredId => ingredId == ingredType.ingredientId)));
    }

    getMenuItemIngredients(){
        this.ingredientsService.getMenuItemIngredients(this.data.menuItem.id)
        .subscribe(
            result => {
                this.menuItemIngredients = result as SelectableMenuItemIngredient[];
            },
            err => {
            }
        );
    }

    editInstructions(){
        this.isEditInstructionsMode = true;
    }

    saveInstructions(){
        this.isEditInstructionsMode = false;
        if (!(this.originalInstructions === this.data.menuItem.recipeInstructions)){
            this.menuService.updateMenuItem(this.data.menuItem)
            .subscribe(
                result => {
                    this.originalInstructions = this.data.menuItem.recipeInstructions;
                },
                err => {
                }
            )
        }
    }

    enableIngredientEditMode(){
        this.ingredientEditMode = true;
        let selectedIngredient = this.menuItemIngredients.find(item => item.selected) as MenuItemIngredient;
        
        if (this.isUpdateMode && selectedIngredient){
            // Fill Fields with the selected ingredient's defaults
            let existingIngredient = this.ingredients.find(ingred => ingred.ingredientId == selectedIngredient.ingredientId);
            let existingMU = this.measurementUnits.find(mu => mu.measurementUnitId == selectedIngredient.measurementUnitId);
            if (existingIngredient){
                this.selectedIngredient = existingIngredient as Ingredient;
            }
            if (existingMU){
                this.selectedMU = existingMU as MeasurementUnit;
            }
            this.selectedIngredientQty = selectedIngredient.ingredientQty;
        }
        else{
            // If 'add ingredient' button was clicked
            // Clear the ingredient (types) that already exist

            this.displayableIngredients = this.ingredients.filter(ingredType => !this.menuItemIngredients
                .map(ingred => ingred.ingredientId)
                .some(ingredId => ingredId == ingredType.ingredientId));
        }
    }

    closeIngredientModifyMenu(canClearAllSelected: boolean){
        this.selectedMU = null as any;
        this.selectedIngredientQty = 0;
        this.ingredientEditMode = false;

        if (canClearAllSelected){
            this.selectedIngredient = null as any;
            this.menuItemIngredients.forEach(ingred => ingred.selected = false);
            this.isUpdateMode = false;
        }
    }

    selectMenuItemIngredient(menuItemIngred: SelectableMenuItemIngredient){
        let isSelected = menuItemIngred.selected;
        this.menuItemIngredients.forEach(ingred => ingred.selected = false);
        this.selectedMUInvalid = false;
        this.selectedIngredientInvalid = false;
        
        if (!isSelected){
            this.isUpdateMode = true;
            menuItemIngred.selected = true;
            let selectedIngred = this.nonFilteredIngredients.find(ingred => ingred.ingredientId == menuItemIngred.ingredientId);
            if (selectedIngred){
                this.selectedIngredient = selectedIngred;
            }
            else{
            }
        }
        else{
            this.isUpdateMode = false;
        }
        this.closeIngredientModifyMenu(false);
    }

    deleteMenuItemIngredient(){
        if (this.selectedIngredient){
            this.ingredientsService.deleteMenuItemIngredient(
                this.data.menuItem.id,
                this.selectedIngredient.ingredientId)
                .subscribe(
                    result => {
                        this.closeIngredientModifyMenu(true);
                        this.getMenuItemIngredients();
                    },
                    err => {
                        this.closeIngredientModifyMenu(true);
                    }
                )
        }
    }

    selectedMUChanged(){
        this.selectedMUInvalid = false;
    }

    selectedIngredientChanged(){
        this.selectedIngredientInvalid = false;
    }

    createIngredient(){
        // Save, then call cancel changes

        if (!this.isUpdateMode){
            if (this.selectedIngredient && this.selectedMU){
                this.ingredientsService.postMenuItemIngredient({
                    menuItemId: this.data.menuItem.id,
                    ingredientId: this.selectedIngredient.ingredientId,
                    ingredientName: this.selectedIngredient.ingredientName,
                    measurementUnitId: this.selectedMU.measurementUnitId,
                    measurementType: this.selectedMU.name,
                    ingredientQty: this.selectedIngredientQty,
                    estCostPerOz: this.selectedIngredient.estCostPerOz,
                })
                    .subscribe(
                        result => {
                            this.closeIngredientModifyMenu(true);
                            this.getMenuItemIngredients();
    
                        },
                        err => {
                            this.closeIngredientModifyMenu(true);
                            this.getMenuItemIngredients();
                        }
                    )
            }
            else{
                if (!this.selectedIngredient){
                    // Mark Red
                    this.selectedIngredientInvalid = true;
                }
                if (!this.selectedMU){
                    // Mark Red
                    this.selectedMUInvalid = true;
                }
            }
        }
        else{
            if (this.selectedIngredient && this.selectedMU){
                this.ingredientsService.putMenuItemIngredient({
                    menuItemId: this.data.menuItem.id,
                    ingredientId: this.selectedIngredient.ingredientId,
                    ingredientName: this.selectedIngredient.ingredientName,
                    measurementUnitId: this.selectedMU.measurementUnitId,
                    measurementType: this.selectedMU.name,
                    ingredientQty: this.selectedIngredientQty,
                    estCostPerOz: this.selectedIngredient.estCostPerOz,
                })
                    .subscribe(
                        result => {
                            this.closeIngredientModifyMenu(true);
                            this.getMenuItemIngredients();
                        },
                        err => {
                            this.closeIngredientModifyMenu(true);
                            this.getMenuItemIngredients();
                        },
                    )
            }
            else{
                if (!this.selectedIngredient){
                    // Mark Red
                    this.selectedIngredientInvalid = true;
                }
                if (!this.selectedMU){
                    // Mark Red
                    this.selectedMUInvalid = true;
                }
            }
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