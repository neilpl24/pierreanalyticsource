export interface ShotModel {
  x: number;
  y: number;
  prevEvent: string;
  type: string;
  xG: number;
  Outcome: string;
  team_skaters?: string;
  opposing_skaters?: string;
  shooter_id?: number;
  home_team: string;
  away_team: string;
  home_goals: string;
  away_goals: string;
  Link: string;
  hasLink: boolean; // can use this later on
}

export function setDefaults(model: ShotModel): ShotModel {
  model.xG = Math.round(model.xG * 100) / 100;
  model.hasLink = model.Link === 'No link found.' ? true : false;

  // should I translate shots here? probably not. need some translation factor
  // add shot switch case. ex) snap -> snapshot
  return model;
}
