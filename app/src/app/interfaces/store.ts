import { Type } from "@angular/core"

export interface Store {
    storeId: number,
    storeName: string,
    launchDate: Date,
}

export interface StoreIngredient{
    weightInOz: number;
    ingredientId: number,
    storeId: number,
    mL: number, /*milliliters*/ 
    ingredientName: string,
    density: number, /* g/ml */
    muName: string,
    muQty: number,
}