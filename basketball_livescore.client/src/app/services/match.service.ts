import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from './match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'https://localhost:7088/api/matches'; 

  constructor(private http: HttpClient) { }

  createMatch(match: Match): Observable<Match> {
    console.log('Creating match at URL:', this.apiUrl);
    return this.http.post<Match>(this.apiUrl, match);
  }

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }
}
