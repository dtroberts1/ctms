import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HighLvlSaleData, Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private serviceUrl = 'http://localhost:3000/api/sales';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getHighLvlSalesData() : Observable<HighLvlSaleData>{
    return this.http.get<HighLvlSaleData>(`${this.serviceUrl}/getHighLvlSalesData`)
      .pipe(map((saleData: HighLvlSaleData) => {
        return saleData;
      }));
  }

  getSales() : Observable<Sale[]>{
    return this.http.get<any[]>(`${this.serviceUrl}/getSales`)
      .pipe(
        map((sales : any[]) => {
          return sales.map(sale => <Sale>{
            saleId: sale.saleId,
            saleDate: new Date(sale.saleDate).toString(),
            itemSold: sale.itemSold,
            menuItemId: sale.menuItemId,
            storeId: sale.storeId,
            salePrice: sale.salePrice,
            saleCost: sale.saleCost,
          });
        })
      );
  }
}
