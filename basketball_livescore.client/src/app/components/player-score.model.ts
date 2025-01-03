export interface PlayerScore {
  id?: number; // Optionnel, généré par le backend
  playerId: number;
  points: number; // 1, 2 ou 3
  scoreTime?: string; // Optionnel
  matchId: number;
}
