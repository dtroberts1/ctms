import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { MenuService } from 'src/app/business-menu/menu-service.service';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { StoreIngredient } from 'src/app/interfaces/store';
import { IngredientService } from 'src/app/services/ingredient-service.service';
import { StoresComponent } from '../stores.component';
type Selectable = {
  selected: boolean,
}
type SelectableMenuItem = MenuItem & Selectable & {count: number, };

type ModalInput = {storeId: number, storeIngredients: Array<StoreIngredient>};
type UsedIngredient = {usedOz: number, ingredientName: string, ingredientId: number}
type StoreIngredientDiff = {ingredientId: number, ingredientName: string, diffOz: number}

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.less']
})
export class SimulatorComponent implements OnInit {
  storeIngredients!: Array<StoreIngredient>;
  selectedMIQty: number = 0;
  selectedIngredQty: number = 0;
  menuItems!: Array<MenuItem>;
  simulatedMenuItems!: Array<SelectableMenuItem>;
  menuItem!: SelectableMenuItem;
  selectedMenuItem!: SelectableMenuItem;
  isUpdateMode: boolean = false;
  usedIngredients!: Array<UsedIngredient>;
  diffIngredients!: Array<StoreIngredientDiff>;

  editMenuItemMode: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalInput,
    public dialogRef: MatDialogRef<SimulatorComponent>,
    private menuService: MenuService,
    private ingredientService: IngredientService,
  ) { 

  }

  ngOnInit(): void {
    this.simulatedMenuItems = [];
    this.usedIngredients = [];
    if (Array.isArray(this.data.storeIngredients)){
      this.storeIngredients = this.data.storeIngredients;
      console.log({"storeIngredients":this.storeIngredients});
    }

    this.menuService.getMenuItems()
      .subscribe(
        res => {
          this.menuItems = res;
          this.menuItems.forEach((item) => {
            this.ingredientService.getMenuItemIngredients(item.id)
              .subscribe(
                res => {
                  item.ingredients = res;
                  
                },
                err => {

                }
              );
          });

        },
        err => {

        }
      );
  }

  

  updateSimulation(){
    this.usedIngredients = [];

    let simMenuItems = JSON.parse(JSON.stringify(this.simulatedMenuItems));
    simMenuItems.forEach((item : SelectableMenuItem) => {
      item.ingredients.forEach((ingred: any) => {
        ingred.multiplier = item.count;
      });
    });

    if (Array.isArray(simMenuItems) && simMenuItems.length){
      let tmp = simMenuItems.map((item : any) => item.ingredients).reduce((a: any, b : any) => a.concat(b));
      tmp.forEach((usedItem : any) => {
        let beforeReduced = tmp.filter((usedIngred: any) => usedIngred.ingredientId == usedItem.ingredientId)
        .map((ingred: any) => ingred.weightInOz * ingred.multiplier); // Need to multiply by number of times sold
        let aggregatedUsedOz = beforeReduced.reduce((a: any, b: any) => a + b);
  
        if (!this.usedIngredients.some(ingred => ingred.ingredientId == usedItem.ingredientId)){
          if (aggregatedUsedOz > 0){
            this.usedIngredients.push({
              usedOz: aggregatedUsedOz,
              ingredientName: usedItem.ingredientName,
              ingredientId: usedItem.ingredientId,
            });
          }
        }
      });
    }
    this.usedIngredients.sort((a,b) => a.ingredientName.localeCompare(b.ingredientName));
    this.setDiffIngredients();
  }

  setDiffIngredients(){
    this.diffIngredients = [];

    if (Array.isArray(this.usedIngredients) && this.usedIngredients.length){
      this.usedIngredients.forEach((usedIngred) => {
        let storeIngredient: StoreIngredient | undefined = null as any;
        storeIngredient = this.storeIngredients.find(ingred => ingred.ingredientId == usedIngred.ingredientId);
  
        this.diffIngredients.push({
          ingredientId: usedIngred.ingredientId, 
          ingredientName: usedIngred.ingredientName, 
          diffOz: storeIngredient && storeIngredient.weightInOz ? storeIngredient.weightInOz - usedIngred.usedOz : -1 * usedIngred.usedOz,
        });
  
        console.log({"this.diffIngredients":this.diffIngredients})
      });
      this.diffIngredients.sort((a,b) => a.ingredientName.localeCompare(b.ingredientName));

    }
  }

  removeMenuItem(){
    // Remove Menu item from simulation list
    this.simulatedMenuItems.forEach(mi => mi.selected = false);

    let delCount = this.simulatedMenuItems.splice((this.simulatedMenuItems as Array<SelectableMenuItem>)
    .findIndex(mi => mi.id === this.selectedMenuItem.id), 1);
    this.simulatedMenuItems.sort((a,b) => a.name.localeCompare(b.name));

    this.selectedMenuItem = null as any;
    this.menuItem = null as any;
    this.isUpdateMode = false;
    this.editMenuItemMode = false;
    this.updateSimulation();
  }

  selectMenuItem(menuItem: SelectableMenuItem){
    let isSelected = menuItem.selected;
    this.menuItems.forEach(mi => mi.selected = false);
    this.simulatedMenuItems.forEach(mi => mi.selected = false);
    
    if (!isSelected){
        this.isUpdateMode = true;
        let selectedMI = this.simulatedMenuItems.find(mi => mi.id == menuItem.id);
        if (selectedMI){
            this.menuItem = selectedMI as SelectableMenuItem;
            this.menuItem.selected = true;
            //menuItem.selected = this.menuItem.selected;
            this.selectedMIQty = this.menuItem.count;
            this.selectedMenuItem = this.menuItem;
        }
        else{
        }
    }
    else{
        this.isUpdateMode = false;
        this.menuItem.selected = false;
        this.selectedMenuItem = null as any;
    }
}


  addOrUpdateMenuItem(){
    if (this.editMenuItemMode){
      this.menuItem.count = this.selectedMIQty;
      this.simulatedMenuItems.push(this.menuItem);
      this.menuItem = null as any;
      this.selectedMenuItem = null as any;
    }
    else{

    }
    this.simulatedMenuItems.forEach(mi => mi.selected = false);
    this.simulatedMenuItems.sort((a,b) => a.name.localeCompare(b.name));
    this.updateSimulation();
  }

  addMenuItem(){
    // Add menu item to simulation
    this.editMenuItemMode = true;

  }

  cancelChanges(){
    this.editMenuItemMode = false;
    this.menuItem = null as any;
    this.selectedMenuItem.selected = false;
    this.selectedMenuItem = null as any;
    this.isUpdateMode = false;
  }

  plusMinusClicked(isPlus: boolean, qtyType: string){
    if (qtyType == 'menuItem'){
      if (isNaN(this.selectedMIQty) || this.selectedMIQty < 0){
        this.selectedMIQty = 0;
      }
      else{
          if (isPlus){
            this.selectedMIQty++;
          }
          else{
              if (this.selectedMIQty > 0){
                this.selectedMIQty--;
              }
          }
      }
      this.menuItem.count = this.selectedMIQty
    }
    else{
      if (isNaN(this.selectedIngredQty) || this.selectedIngredQty < 0){
        this.selectedIngredQty = 0;
      }
      else{
          if (isPlus){
            this.selectedIngredQty++;
          }
          else{
              if (this.selectedIngredQty > 0){
                this.selectedIngredQty--;
              }
          }
      }
    }
    this.updateSimulation();

}
  close(){
    this.dialogRef.close();   
  }
}