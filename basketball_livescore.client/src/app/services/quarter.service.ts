import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quarter } from './quarter.model';

@Injectable({
  providedIn: 'root'
})
export class QuarterService {

  private apiUrl = 'https://localhost:7088/api/quarters'; 

  constructor(private http: HttpClient) { }

  createQuarter(quarter: Quarter): Observable<Quarter> {
    return this.http.post<Quarter>(this.apiUrl, quarter);
  }
}
