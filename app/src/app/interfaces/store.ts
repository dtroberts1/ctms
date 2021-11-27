import { Type } from "@angular/core"

export interface Store {
    storeId: number | null,
    storeName: string,
    launchDate: Date | string,
    streetAddr1: string,
    streetAddr2: string,
    city: string,
    state: string,
    zipcode: string,
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
    estCostPerOz: number,
}