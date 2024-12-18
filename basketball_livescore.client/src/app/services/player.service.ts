import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from './player.model'; // Assurez-vous d'avoir un modèle Player

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = 'api/players'; // URL de l'API

  constructor(private http: HttpClient) { }

  // Méthode pour créer un joueur
  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  // Méthode pour obtenir tous les joueurs (optionnel)
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }
}
