import { roundDecimal, roundValue } from 'src/app/utils';

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

export function setDefaults(model: TeamLeaderboardModel) {
  model.finishing = roundDecimal(model.finishing);
  model.gsax = roundDecimal(model.gsax);
  model.ev_xGA = roundDecimal(model.ev_xGA);
  model.ev_xGF = roundDecimal(model.ev_xGF);
  return model;
}
