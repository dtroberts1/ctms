import { Ingredient } from "./ingredient";

export interface MenuItem {
    type: string,
    name: string,
    description: string,
    ingredients: Array<Ingredient>,
    price: number,
    cost: number,
    ranking: number,  
}
