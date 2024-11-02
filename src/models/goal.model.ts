import { getShotType } from 'src/app/utils';

export interface GoalModel {
  season: number;
  date: Date;
  shooter: string;
  shooterId: number;
  assister: string;
  assisterId: number;
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
  hasLink: boolean;
}

export function setDefaults(model: GoalModel): GoalModel {
  model.xG = Math.round(model.xG * 100) / 100;

  // for some reason, the link is an array if there's no link found
  // would be much better to be a string | null
  model.hasLink = model.link[0] === 'No link found.' ? false : true;
  model.type = getShotType(model.type);

  // add shot switch case. ex) snap -> snapshot
  return model;
}
