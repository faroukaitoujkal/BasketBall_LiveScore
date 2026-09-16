import { Team } from './team.model';

export enum MatchStatus {
  Scheduled = 0,
  InProgress = 1,
  Finished = 2,
  Canceled = 3
}

export interface Match {
  id: number;
  matchDate: string;
  location: string;
  
  homeTeamId: number;
  homeTeam?: Team;
  awayTeamId: number;
  awayTeam?: Team;
  
  numberOfQuarters: number;
  quarterDuration: number;
  timeoutDuration: number;
  
  currentQuarter: number;
  homeTeamScore: number;
  awayTeamScore: number;
  status: MatchStatus;
  season?: string;

  homeTeamStartingPlayers?: number[];
  awayTeamStartingPlayers?: number[];
  liveEncoders?: string[];
}
