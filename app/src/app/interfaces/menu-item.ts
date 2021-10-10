import { Ingredient } from "./ingredient";

export interface MenuItem {
    [key: string]: any
    type: string,
    name: string,
    description: string,
    /*ingredients: Array<Ingredient>,*/
    price: number,
    cost: number,
    averageReviewRating: number,
    qtySold: number,
    popularity: number,
    reviewRank: number,
    recipeInstructions: string,
}
