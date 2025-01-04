import { Player } from "./player.model";

export interface Match {
  id?: number;
  matchDate: Date;
  location: string;
  homeTeamId: number;
  awayTeamId: number;
  numberOfQuarters: number;
  quarterDuration: number;
  timeoutDuration: number;
  encodedBy?: string;
  currentQuarter?: number; 
  liveEncoders?: string[];
  homeTeam?: Team;
  awayTeam?: Team;
  homeTeamStartingPlayers?: Player[];
  awayTeamStartingPlayers?: Player[];
  homeTeamScore: number;
  awayTeamScore: number;
  isFinished: boolean;
}
export interface Team {
  name: string;
  id: number;
}

export interface Foul {
  team: string;  // "Home" ou "Away"
  player: string;  // Nom du joueur fautif
  description: string;  // Description de la faute
  time: string;  // Temps où la faute a été réalisée
}
