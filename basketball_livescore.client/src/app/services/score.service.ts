import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerScore } from './player-score.model';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = '/api/playerscores';

  constructor(private http: HttpClient) { }

  addScore(score: PlayerScore): Observable<PlayerScore> {
    return this.http.post<PlayerScore>(`${this.apiUrl}/add-score`, score);
  }

  getScoresByMatch(matchId: number): Observable<PlayerScore[]> {
    return this.http.get<PlayerScore[]>(`${this.apiUrl}/match/${matchId}`);
  }
}
