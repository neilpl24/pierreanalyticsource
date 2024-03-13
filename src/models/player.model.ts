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
}
