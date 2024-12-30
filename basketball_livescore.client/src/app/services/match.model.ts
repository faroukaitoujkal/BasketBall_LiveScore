import { Team } from "./team.model";
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
    liveEncoders?: string[];
    homeTeam?: Team; 
    awayTeam?: Team;
    homeTeamStartingPlayers?: Player[];
    awayTeamStartingPlayers?: Player[]; 
  }
