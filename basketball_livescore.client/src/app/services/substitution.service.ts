import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Substitution } from '../components/substitution.model';

@Injectable({
  providedIn: 'root'
})
export class SubstitutionService {
  private apiUrl = 'https://localhost:7088/api/substitutions'; // L'URL de votre API

  constructor(private http: HttpClient) { }

  // Enregistrer une substitution
  recordSubstitution(substitution: Substitution): Observable<Substitution> {
    return this.http.post<Substitution>(this.apiUrl, substitution);
  }

  // Récupérer les substitutions par match
  getSubstitutionsByMatch(matchId: number): Observable<Substitution[]> {
    return this.http.get<Substitution[]>(`${this.apiUrl}/match/${matchId}`);
  }
}
