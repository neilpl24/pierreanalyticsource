import { getShotType } from 'src/app/utils';

export interface ShotModel {
  date: string;
  x: number;
  y: number;
  prevEvent: string;
  type: string;
  xG: number;
  Outcome: string;
  team_skaters?: string;
  opposing_skaters?: string;
  shooter_id?: number;
  strength: string;
  home_team: string;
  away_team: string;
  home_goals: string;
  away_goals: string;
  Link: string;

  hasLink: boolean; // can use this later on
}

export function setDefaults(model: ShotModel): ShotModel {
  model.xG = Math.round(model.xG * 100) / 100;

  // for some reason, the link is an array if there's no link found
  // would be much better to be a string | null
  model.hasLink = model.Link[0] === 'No link found.' ? false : true;
  model.type = getShotType(model.type);

  // add shot switch case. ex) snap -> snapshot
  return model;
}
