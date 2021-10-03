import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Ingredient, MeasurementUnit, MenuItemIngredient } from '../interfaces/ingredient';
import { HighLvlSaleData } from '../interfaces/sale';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private serviceUrl = 'http://localhost:3000/api/ingredients';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient,
    private toastr : ToastrService
    
    ) { }

  getMenuItemIngredients(menuItemId: number) : Observable<MenuItemIngredient[]>{
    return this.http.get<MenuItemIngredient[]>(`${this.serviceUrl}/getMenuItemIngredients/${menuItemId}`)
      .pipe(map((menuItemIngredients: MenuItemIngredient[]) => {
        return menuItemIngredients
      }))
  }

  getIngredients() : Observable<Ingredient[]>{
    return this.http.get<Ingredient[]>(`${this.serviceUrl}/getIngredients`)
      .pipe(map((ingredients: Ingredient[]) => {
        return ingredients
      }))
  }

  getMeasurementUnits() : Observable<MeasurementUnit[]>{
    return this.http.get<MeasurementUnit[]>(`${this.serviceUrl}/getMeasurementUnits`)
      .pipe(map((measurementUnits: MeasurementUnit[]) => {
        return measurementUnits
      }))
  }
  postMenuItemIngredient(menuIngredient: MenuItemIngredient) : Observable<Object>{
    console.log({"inputIngredient":menuIngredient})
    let failed = false

    const headers = { 'content-type': 'application/json'}  
    return this.http.post(`${this.serviceUrl}/postMenuItemIngredient`, JSON.stringify(menuIngredient), {'headers': headers})
    .pipe(
    map((item: Object) => {
      return item;
    }),
    catchError((err, caught) => {
      failed = true;
      this.toastr.warning("Unable to save");
      return of(`i caught error`);
    }),
    finalize(() => {if(!failed){
      this.toastr.success("Ingredient Added");
    }}));  

  }
}
