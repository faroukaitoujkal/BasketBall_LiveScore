export interface Foul {
  id: number;
  playerId: number;  // L'ID du joueur
  player: {
    id: number;       // ID du joueur
    name: string;     // Nom du joueur
    number: number;   // Numéro du joueur
    teamId: number;   // ID de l'équipe
  };
  foulType: string;   // Type de la faute (P0, P1, P2, P3)
  quarter: number;    // Quart-temps (1 à 4)
  gameTime: string;   // Temps du match (format MM:SS)
  matchId: number;    // ID du match (ajouté pour associer la faute à un match)
}
