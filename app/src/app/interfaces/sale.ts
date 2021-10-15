import { Type } from "@angular/core"

export interface Sale {
    [key: string]: any,
    saleId: number,
    saleDate: Date | string,
    itemSold: string,
    menuItemId: number,
    storeId: number,
    salePrice: number,
    saleCost: number,
    transactionId: number | null,
}

type menuPopularitySale = {
    nbrItemsSoldMenuItem: number | null,
    salesForItem: number | null,
    menuItemId: number | null,
    menuName: string | null,
}

type storePopularitySale = {
    nbrItemsSoldStore: number | null,
    salesForStore: number | null,
    storeId: number | null,
    storeName: string | null,
}

export interface HighLvlSaleData {
    salesForCurrYear: number,
    salesForCurrMonth: number,
    menuPopularitySales: menuPopularitySale[],
    storePopularitySales: storePopularitySale[],
    revenuePeriodSales: {
        periodRevenue: number | null,
        periodCosts: number | null,
    }
}
