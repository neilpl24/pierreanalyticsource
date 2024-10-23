export interface GoalModel {
  season: number;
  date: Date;
  shooter: string;
  shooterId: number;
  goalie: string;
  goalieId: number;
  strength: string;
  awayGoals: number;
  homeGoals: number;
  homeTeam: string;
  awayTeam: string;
  x: number;
  y: number;
  prevEvent: string;
  type: string;
  xG: number;
  outcome: string;
  wpa: number;
  link: string;
}
