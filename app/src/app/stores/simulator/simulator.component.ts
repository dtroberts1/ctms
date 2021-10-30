import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuService } from 'src/app/business-menu/menu-service.service';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { StoreIngredient } from 'src/app/interfaces/store';
type Selectable = {
  selected: boolean,
}
type SelectableMenuItem = MenuItem & Selectable & {count: number};

type SelectableStoreIngredient = StoreIngredient & Selectable;
type ModalInput = {storeId: number, storeIngredients: Array<StoreIngredient>};

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

  editMenuItemMode: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalInput,
    private menuService: MenuService,
  ) { 

  }

  ngOnInit(): void {
    this.simulatedMenuItems = [];
    console.log({"data":this.data});
    if (Array.isArray(this.data.storeIngredients)){
      this.storeIngredients = this.data.storeIngredients;
    }

    this.menuService.getMenuItems()
      .subscribe(
        res => {
          this.menuItems = res;
          console.log({"menuItems":this.menuItems})
        },
        err => {

        }
      );
  }

  removeMenuItem(){
    // Remove Menu item from simulation list
    console.log({"this.simulatedMenuItems_b4Rmv":JSON.parse(JSON.stringify(this.simulatedMenuItems))})
    this.simulatedMenuItems.forEach(mi => mi.selected = false);

    let delCount = this.simulatedMenuItems.splice((this.simulatedMenuItems as Array<SelectableMenuItem>)
    .findIndex(mi => mi.id === this.selectedMenuItem.id), 1);
    this.simulatedMenuItems.sort((a,b) => a.name.localeCompare(b.name));

    //this.menuItem = null as any;
    //this.selectedMenuItem = null as any;
    console.log({"this.simulatedMenuItems_after":JSON.parse(JSON.stringify(this.simulatedMenuItems))})
    console.log({"delCount":delCount});
    this.selectedMenuItem = null as any;
    this.menuItem = null as any;
    this.isUpdateMode = false;
    this.editMenuItemMode = false;
  }

  selectMenuItem(menuItem: SelectableMenuItem){
    let isSelected = menuItem.selected;
    this.menuItems.forEach(mi => mi.selected = false);
    this.simulatedMenuItems.forEach(mi => mi.selected = false);
    console.log({"initial":JSON.parse(JSON.stringify(this.simulatedMenuItems))})
    
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
    console.log({"this.simulatedMenuItems":this.simulatedMenuItems})
    //this.closeIngredientModifyMenu(false);
}


  addOrUpdateMenuItem(){
    if (this.editMenuItemMode){
      this.menuItem.count = this.selectedMIQty;
      this.simulatedMenuItems.push(this.menuItem);
      console.log({"this.simulatedMenuItems":this.simulatedMenuItems});
      this.menuItem = null as any;
      this.selectedMenuItem = null as any;
    }
    else{

    }
    this.simulatedMenuItems.forEach(mi => mi.selected = false);
    this.simulatedMenuItems.sort((a,b) => a.name.localeCompare(b.name));

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
    console.log("string is " + qtyType);
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

}

}