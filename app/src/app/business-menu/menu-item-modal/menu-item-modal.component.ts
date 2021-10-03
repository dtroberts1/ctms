import { Component, Inject, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Ingredient } from "src/app/interfaces/ingredient";
import { MenuItem } from "src/app/interfaces/menu-item";
import { IngredientService } from "src/app/services/ingredient-service.service";

type ModalInput = {title: string; menuItem: MenuItem} 

@Component({
    selector: 'app-menu-item-modal',
    templateUrl: 'menu-item-modal.component.html',
    styleUrls: ['menu-item-modal.component.less'],
  })
  export class MenuItemModalComponent {
    ingredients!: Ingredient[];
    ingredientEditMode: boolean = false;
    constructor(
      public dialogRef: MatDialogRef<MenuItemModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ModalInput,
      private ingredientsService: IngredientService,
      ) {}

    ngOnInit(){
        this.ingredientsService.getMenuItemIngredients(this.data.menuItem.id)
            .subscribe(
                result => {
                    console.log({"result":result})
                    this.ingredients = result;
                },
                err => {
                    console.log({"err":err})
                }
            )
    }

    enableIngredientEditMode(){
        this.ingredientEditMode = true;
    }

    plusMinusClicked(isPlus: boolean){
        console.log("plus or minus clicked")
    }
  
    close(): void {
      this.dialogRef.close();   
    }
  
  }