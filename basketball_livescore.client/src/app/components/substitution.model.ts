export interface Substitution {
  id?: number;
  playerInId: number;
  playerOutId: number;
  quarter: number;
  gameTime: string;  // Format "MM:SS"
  matchId: number;
}
