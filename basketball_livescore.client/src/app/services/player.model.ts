export interface Team {
  id?: number;
  name: string;
}

export interface Player {
  id?: number;
  name: string;
  number: number;
  teamId: number;
  team?: Team; 
}
