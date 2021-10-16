import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getHighLvlSalesData(startDate: string | null, endDate: string | null) : Observable<HighLvlSaleData>{
    return this.http.get<HighLvlSaleData>(`${this.serviceUrl}/getHighLvlSalesData/${startDate}/${endDate}`)
      .pipe(map((saleData: HighLvlSaleData) => {
        return saleData;
      }));
  }

  getWeekMonthYearRevenues(){
    return this.http.get<any>(`${this.serviceUrl}/getWeekMonthYearRevenues`)
    .pipe(map((saleData: any) => {
      return saleData;
    }));
  }

  addSale(sale: Sale){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };

    return this.http.post<string>(`${this.serviceUrl}/addSale`,
    sale, httpOptions
    )    
    .pipe(
      map((res: any) =>{
        this.toastr.success("Sale Added");
        return res;
      })
    );
  }

  updateSale(sale: Sale){

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };

    return this.http.put<string>(`${this.serviceUrl}/updateSale`,
    sale, httpOptions
    )
    .pipe(
      map((res: any) =>{
        this.toastr.success("Sale Saved");
        return res;
      })
    );
  }

  deleteSale(saleId: number) : Observable<Object>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };
    return this.http.delete(`${this.serviceUrl}/deleteSale/${saleId}`, {responseType: 'text'})
    .pipe(
      map((item: string) => {
        this.toastr.success("Sale Item Deleted");
        return item;
      })
    );
  }

  deleteSales(saleIds: number[]) : Observable<Object>{
    const httpOptions = {
      headers: new HttpHeaders({
        /*'Content-Type':  'application/json',*/
        /*Authorization: 'my-auth-token'*/
      }),
      body: {selectedIds: saleIds},
    };
    return this.http.delete(`${this.serviceUrl}/deleteSales`, httpOptions)    
    .pipe(
      map(() => {
        this.toastr.success(`Sale Item${saleIds.length > 1 ? 's':''} Deleted`);
        return 'Success';
      })
    );
  }

  getSales(startDate: any, endDate: any) : Observable<Sale[]>{
    if (startDate && endDate){
      return this.http.get<any[]>(`${this.serviceUrl}/getSales/${startDate}/${endDate}`)
      .pipe(
        map((sales : any[]) => {
          return sales.map(sale => <Sale>{
            saleId: sale.saleId,
            saleDate: new Date(sale.saleDate),
            itemSold: sale.itemSold,
            menuItemId: sale.menuItemId,
            storeId: sale.storeId,
            salePrice: sale.salePrice,
            saleCost: sale.saleCost,
          });
        })
      );
    }
    else{
      return this.http.get<any[]>(`${this.serviceUrl}/getSales`)
      .pipe(
        map((sales : any[]) => {
          return sales.map(sale => <Sale>{
            saleId: sale.saleId,
            saleDate: new Date(sale.saleDate),
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
}
