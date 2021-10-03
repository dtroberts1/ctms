import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingredient } from '../interfaces/ingredient';
import { HighLvlSaleData } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private serviceUrl = 'http://localhost:3000/api/ingredients';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getMenuItemIngredients(menuItemId: number) : Observable<Ingredient[]>{
    console.log("menu id is " + menuItemId)
    /*
    let options = {
      params: new HttpParams({fromObject: {'id': menuItemId}, })
     };
     */
     // Another way:
     /*
    const params = new HttpParams()
      .set('id', menuItemId)
    */   
    return this.http.get<Ingredient[]>(`${this.serviceUrl}/getMenuItemIngredients/${menuItemId}`)
      .pipe(map((ingredients: Ingredient[]) => {
        return ingredients
      }))
  }
}
