export interface Standing {
  teamId: number;
  teamName: string;
  teamLogoUrl?: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  winPercentage: number;
}
