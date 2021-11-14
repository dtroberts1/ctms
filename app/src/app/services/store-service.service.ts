import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HighLvlSaleData, Sale } from '../interfaces/sale';
import { Store, StoreIngredient } from '../interfaces/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private serviceUrl = 'http://localhost:3000/api/stores';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getStores() : Observable<Store[]>{
    return this.http.get<any[]>(`${this.serviceUrl}/getStores`)
      .pipe(
        map((stores : any[]) => {
          return stores.map(store => <Store>{
            storeId: store.storeId,
            storeName: store.storeName,
            launchDate: store.launchDate,
          });
        })
      );
  }
}
