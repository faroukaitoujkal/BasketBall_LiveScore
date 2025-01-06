export interface PlayerScore {
  id?: number; 
  playerId: number;
  points: number; // 1, 2 ou 3
  scoreTime?: string; 
  matchId: number;
}
