export interface Quarter {
  id: number;
  matchId: number;     // Référence au match
  quarterNumber: number; // Numéro du quart-temps (1 à 4)
  duration: string;      // Durée du quart-temps au format "hh:mm:ss"
}
