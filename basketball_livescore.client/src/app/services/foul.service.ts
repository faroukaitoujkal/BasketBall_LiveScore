import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Foul } from './foul.model'; 

@Injectable({
  providedIn: 'root'
})
export class FoulService {
  private apiUrl = 'https://localhost:7088/api/fouls'; // L'URL de votre API

  constructor(private http: HttpClient) { }

  createFoul(foul: Foul): Observable<Foul> {
    return this.http.post<Foul>(this.apiUrl, foul);
  }

  getFoulsByMatch(matchId: number): Observable<Foul[]> {
    return this.http.get<Foul[]>(`${this.apiUrl}/match/${matchId}`);
  }
}

export { Foul };
