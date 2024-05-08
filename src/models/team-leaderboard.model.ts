export interface TeamLeaderboardModel {
  [key: string]: any; // Index signature
  teamName: string;
  teamId: number;
  season: number;
  wins: number;
  losses: number;
  otl: number;
  points: number;
  gamesPlayed: number;
  ev_xGF: number;
  ev_xGA: number;
  pp: number;
  pk: number;
  finishing: number;
  gsax: number;
  xGPercentage: number;
}
