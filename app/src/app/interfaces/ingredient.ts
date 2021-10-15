export interface MenuItemIngredient {
    ingredientId: number,
    menuItemId: number | null,
    measurementUnitId: number,
    ingredientName: string,
    measurementType: string,
    ingredientQty: number,
}

export interface Ingredient {
    ingredientId: number,
    ingredientName: string,
    ingredientTypeId: number,
}

export interface IngredientType {
    ingredientTypeId: number,
    name: string,
}

export interface MeasurementUnit {
    measurementUnitId: number,
    name: string,
}
