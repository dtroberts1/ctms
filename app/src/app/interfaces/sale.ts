export interface Sale {
    [key: string]: any,
    saleId: number,
    saleDate: string,
    itemSold: string,
    menuItemId: number,
    storeId: number,
    salePrice: number,
    saleCost: number,
}

export interface HighLvlSaleData {
    salesForCurrYear: number,
    salesForCurrMonth: number,
}
