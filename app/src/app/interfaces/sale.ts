export interface Sale {
    saleId: number,
    saleDate: Date,
    menuItemId: number,
    storeId: number,
    salePrice: number,
    saleCost: number,
}

export interface HighLvlSaleData {
    salesForCurrYear: number,
    salesForCurrMonth: number,
}
