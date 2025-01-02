import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TimeoutMatch {
  id: number;
  matchId: number;
  quarter: number;
  gameTime: string; // Représentation en string pour TimeSpan
  duration: string; // Représentation en string pour TimeSpan
}

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  private apiUrl = 'https://localhost:7088/api/Timeouts'; // URL de l'API

  constructor(private http: HttpClient) { }

  getTimeoutsByMatch(matchId: number): Observable<TimeoutMatch[]> {
    return this.http.get<TimeoutMatch[]>(`${this.apiUrl}?matchId=${matchId}`);
  }

  createTimeout(timeout: TimeoutMatch): Observable<TimeoutMatch> {
    return this.http.post<TimeoutMatch>(this.apiUrl, timeout);
  }

  createTimeoutFromMatch(matchId: number, timeout: Partial<TimeoutMatch>): Observable<TimeoutMatch> {
    return this.http.post<TimeoutMatch>(`${this.apiUrl}/create-from-match/${matchId}`, timeout);
  }
}
