export interface PlayerScore {
  id?: number; // Optionnel, généré par le backend
  playerId: number;
  player: {
    name: string;
    number: number;
    teamId: number;
  };
  points: number; // 1, 2 ou 3
  scoreTime?: string; // Optionnel
  matchId: number;
}
