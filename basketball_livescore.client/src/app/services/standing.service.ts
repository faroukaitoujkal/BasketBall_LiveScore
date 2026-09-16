import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Standing } from './standing.model';

@Injectable({
  providedIn: 'root'
})
export class StandingService {
  private apiUrl = '/api/standings';

  constructor(private http: HttpClient) { }

  getStandings(): Observable<Standing[]> {
    return this.http.get<Standing[]>(this.apiUrl);
  }
}
