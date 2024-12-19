import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'api/teams';

  constructor(private http: HttpClient) { }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }
}
