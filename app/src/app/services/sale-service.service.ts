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

  getHighLvlSalesData() : Observable<HighLvlSaleData>{
    return this.http.get<HighLvlSaleData>(`${this.serviceUrl}/getHighLvlSalesData`)
      .pipe(map((saleData: HighLvlSaleData) => {
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

  getSales() : Observable<Sale[]>{
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
