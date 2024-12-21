import { Team } from "./player.model";

export interface Match {
  id?: number;
  matchDate: Date;
  location: string;
  homeTeamId: number;
  homeTeam?: Team;
  awayTeamId: number;
  awayTeam?: Team;
  encodedBy?: string;
  liveEncoders?: string[];
  numberOfQuarters?: number;
  quarterDuration?: number;
  timeoutDuration?: number;
}
