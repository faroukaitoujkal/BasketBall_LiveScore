import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from './match.model';
import { tap } from 'rxjs/operators';

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
    return this.http.get<Match[]>(this.apiUrl).pipe(
      tap(matches => console.log('Matches retrieved:', matches))
    );
  }

  getMatch(id: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  updateMatch(id: number, match: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
  }

  deleteMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
