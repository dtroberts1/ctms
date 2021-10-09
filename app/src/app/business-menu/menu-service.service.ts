import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { MenuItem } from '../interfaces/menu-item';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private serviceUrl = 'http://localhost:3000/api/menuItems';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getMenuItems() : Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(`${this.serviceUrl}/getMenuItems`)
      .pipe(map((menuItems: MenuItem[]) => {
        return menuItems;
      }));
  }
  updateMenuItem(menuItem: MenuItem){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };

    return this.http.put<string>(`${this.serviceUrl}/updateMenuItem`,
      menuItem, httpOptions
    ).pipe(
      map((item: string) => {
        this.toastr.success("Menu Item Saved");
        return item;
      })
    );
  }

  addMenuItem(menuItem: MenuItem){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };

    return this.http.post<string>(`${this.serviceUrl}/addMenuItem`,
      menuItem, httpOptions
    );
  }

  deleteMenuItem(menuId: number) : Observable<Object>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        /*Authorization: 'my-auth-token'*/
      })
    };
    return this.http.delete(`${this.serviceUrl}/deleteMenuItem/${menuId}`, {responseType: 'text'})
    .pipe(
      map((item: string) => {
        this.toastr.success("Menu Item Deleted");
        return item;
      })
    );
  }

  deleteMenuItems(menuIds: number[]) : Observable<Object>{
    const httpOptions = {
      headers: new HttpHeaders({
        /*'Content-Type':  'application/json',*/
        /*Authorization: 'my-auth-token'*/
      }),
      body: {selectedIds: menuIds},
    };
    return this.http.delete(`${this.serviceUrl}/deleteMenuItems`, httpOptions)    
    .pipe(
      map(() => {
        this.toastr.success("Menu Items Deleted");
        return 'Success';
      })
    );
  }
}
