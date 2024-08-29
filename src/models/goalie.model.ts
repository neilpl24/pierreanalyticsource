import { getPlayerPosition, roundDecimal } from '../app/utils';
export interface GoalieModel {
  position: string;
  firstName: string;
  lastName: string;
  birthDate: number;
  nationality: string;
  height: number;
  weight: number;
  team: string;
  teamId: number;
  handedness: string;
  toi: number;
  starts: number;
  shootout: number;
  lowDanger: number;
  mediumDanger: number;
  mediumDangerFreq: number;
  highDanger: number;
  highDangerFreq: number;
  pk: number;
  ev: number;
  shots: number;
  playerID: number;
}

export function setDefaults(model: GoalieModel) {
  model.position = getPlayerPosition(model.position);
  model.starts = roundDecimal(model.starts);
  model.shootout = roundDecimal(model.shootout);
  model.pk = roundDecimal(model.pk);
  model.ev = roundDecimal(model.ev);

  return model;
}
