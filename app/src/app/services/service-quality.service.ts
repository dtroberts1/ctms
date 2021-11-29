import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceQualityService {
  private serviceUrl = `${environment.baseUrl}/serviceQuality`;  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getEmployeeServiceSummaries(): Observable<any[]>{
    return this.http.get<any[]>(`${this.serviceUrl}/getEmployeeServiceSummaries`);
  }
 
  getStoreServiceSummaries() : Observable<any[]>{
    return this.http.get<any[]>(`${this.serviceUrl}/getStoreServiceSummaries`);
  }
}
