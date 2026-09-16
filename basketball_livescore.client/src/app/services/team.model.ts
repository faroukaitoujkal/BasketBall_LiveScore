import { Player } from './player.model';

export interface Team {
  id: number;
  name: string;
  city?: string;
  coachName?: string;
  logoUrl?: string;
  primaryColor?: string;
  players?: Player[];
}
