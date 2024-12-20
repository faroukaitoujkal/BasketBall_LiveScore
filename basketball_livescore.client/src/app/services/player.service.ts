import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from './player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'https://localhost:7088/api/players'; 

  constructor(private http: HttpClient) { }

  createPlayer(player: Player): Observable<Player> {
    console.log('Creating player at URL:', this.apiUrl); 
    return this.http.post<Player>(this.apiUrl, player);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }
}
