import { getPlayerPosition, roundDecimal } from 'src/app/utils';

// Non statistical information regarding a player
export interface PlayerModel {
  firstName: string;
  lastName: string;
  playerID: number;
  birthDate: string;
  nationality: string;
  position: string;
  height: string; // the new nhl api returns height as in inches
  weight: number;
  teamId: number;
  team: string;
  handedness: string;
  shots: string;
  assists: string;
  goals: number;
  primaryAssistsEV: number;
  xGF: number;
  xGA: number;
  gsae: number;
}

export function setDefaults(model: PlayerModel) {
  model.position = getPlayerPosition(model.position);
  model.goals = roundDecimal(model.goals);
  model.primaryAssistsEV = roundDecimal(model.primaryAssistsEV);
  model.xGF = roundDecimal(model.xGF);
  model.xGA = roundDecimal(model.xGA);
  model.gsae = roundDecimal(model.gsae);
  return model;
}
