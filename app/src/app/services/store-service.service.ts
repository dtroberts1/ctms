import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HighLvlSaleData, Sale } from '../interfaces/sale';
import { Store, StoreIngredient } from '../interfaces/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private serviceUrl = `${environment.baseUrl}/stores`;  // URL to web api

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
            streetAddr1: store.streetAddr1,
            streetAddr2: store.streetAddr2,
            city: store.city,
            state: store.state,
            zipcode: store.zipcode,
          });
        })
      );
  }

  deleteStore(storeId: number){
    return this.http.delete(`${this.serviceUrl}/deleteStore/${storeId}`, {responseType: 'text'})
    .pipe(
      map((item: string) => {
        this.toastr.success("Store Removed");
        return item;
      })
    );
  }

  putStoreDetails(store: Store){
    if (store.launchDate && store.launchDate instanceof Date){
      let launchDate = (<Date>store.launchDate).toISOString().substr(0, (<Date>store.launchDate).toISOString().indexOf('T'));
      store.launchDate = launchDate;
    }
    else if (store.launchDate && (typeof store.launchDate === 'string')){
      store.launchDate = store.launchDate.substr(0, (store.launchDate.indexOf('T')));
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };

    return this.http.put<string>(`${this.serviceUrl}/putStoreDetails`,
    store, httpOptions
    )    
    .pipe(
      map((res: any) =>{
        this.toastr.success("Store Saved");
        return res;
      })
    );
  }

  addStore(store: Store){
    // Convert from Date to String
    if (store.launchDate){
      let launchDate = (<Date>store.launchDate).toISOString().substr(0, (<Date>store.launchDate).toISOString().indexOf('T'));
      store.launchDate = launchDate;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };

    return this.http.post<string>(`${this.serviceUrl}/addStore`,
    store, httpOptions
    )    
    .pipe(
      map((res: any) =>{
        this.toastr.success("Store Added");
        return res;
      })
    );
  }
}
