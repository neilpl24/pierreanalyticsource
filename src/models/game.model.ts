// An NHL scorecard
export interface ScoreCardModel {
  awayTeamAbbr: string;
  awayTeamCity: string;
  awayTeamFullName: string;
  awayTeamLogo: string;
  awayTeamScore: number;
  awayTeamName: string;
  awayTeamRecord: string;
  easternUTCOffset: string;
  gameDate: string;
  gameState: string;
  gameType: string;
  homeTeamAbbr: string;
  homeTeamCity: string;
  homeTeamFullName: string;
  homeTeamScore: number;
  homeTeamLogo: string;
  homeTeamName: string;
  homeTeamRecord: string;
  season: string;
  startTime: Date;
  venue: string;
  localeTime: string;
}

export const gameTypeMap: { [key: string]: string } = {
  '1': 'Preseason',
  '2': 'Regular Season',
  '3': 'Playoffs',
};

export const gameStates: { [key: string]: string } = {
  OFF: 'Final',
};

export function setDefaults(model: ScoreCardModel): ScoreCardModel {
  model.startTime = new Date(model.startTime);
  model.gameType = gameTypeMap[model.gameType];
  model.gameState = gameStates[model.gameState] || model.gameState;
  return model;
}
