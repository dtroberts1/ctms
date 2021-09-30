import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MenuItem } from '../menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private heroesUrl = 'http://localhost:3000/api/menuItems';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getMenuItems() : Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(`${this.heroesUrl}/getMenuItems`)
      .pipe(map((menuItems: MenuItem[]) => {
        console.log({"menuItems":menuItems})
        return menuItems;
      }));
  }
  deleteMenuItem(menuId: number) : Observable<Object>{
    return this.http.delete(`${this.heroesUrl}/deleteMenuItem/${menuId}`, {responseType: 'text'});
  }
}
