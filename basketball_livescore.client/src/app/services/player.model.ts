import { Team } from './team.model';

export interface Player {
  id: number;
  name: string;
  number: number;
  position?: string;
  height?: number;
  weight?: number;
  imageUrl?: string;
  teamId: number;
  team?: Team;
}
