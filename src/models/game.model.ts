// An NHL scorecard
export interface ScoreCardModel {
  gamePk: number;
  awayTeam: string;
  awayRecord: string;
  awayScore: number;
  homeTeam: string;
  homeRecord: string;
  homeScore: number;
}
