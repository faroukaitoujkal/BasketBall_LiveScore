import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timeout } from './timeout.model';

export interface TimeoutMatch {
  id: number;
  matchId: number;
  quarter: number;
  gameTime: string; 
  duration: string; 
}

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  private apiUrl = 'https://localhost:7088/api/Timeouts'; 

  constructor(private http: HttpClient) { }

  getTimeoutsByMatch(matchId: number): Observable<TimeoutMatch[]> {
    return this.http.get<TimeoutMatch[]>(`${this.apiUrl}/match/${matchId}`);  
  }

  getTimeoutsByMatchs(matchId: number): Observable<Timeout[]> {  // pour la page de détail
    return this.http.get<Timeout[]>(`${this.apiUrl}/match/${matchId}`);
  }

  createTimeout(timeout: TimeoutMatch): Observable<TimeoutMatch> {
    return this.http.post<TimeoutMatch>(this.apiUrl, timeout);
  }

  createTimeoutFromMatch(matchId: number, timeout: Partial<TimeoutMatch>): Observable<TimeoutMatch> {
    return this.http.post<TimeoutMatch>(`${this.apiUrl}/create-from-match/${matchId}`, timeout);
  }
}
