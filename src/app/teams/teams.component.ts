import { Component, AfterViewInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { TeamModel } from 'src/models/team.model';
import { Observable } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StandingsModel } from 'src/models/standings.model';
import { RosterModel } from 'src/models/roster.model';
import { TeamCardModel } from 'src/models/team-card.model';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private teamSvc: TeamsService,
    private router: Router
  ) {}

  navColor: string;
  secondaryColor: string;

  public team$: Observable<TeamModel | null>;
  public teamCard$: Observable<TeamCardModel | null>;
  public standings$: Observable<StandingsModel | null>;
  public roster$: Observable<RosterModel[] | null>;

  goalies: any;
  forwards: any;
  defense: any;

  rankPostfix: string;

  totalTeams = 32; // total number of teams in the NHL

  // array of props to that have rank badges
  rankProperties = [
    // title is what is displayed on the badge
    { colName: 'leagueRank', title: 'Lg.' },
    { colName: 'divisionRank', title: 'Div.' },
    { colName: 'xGPercentageRank', title: 'xG%' },
    { colName: 'ev_xGFRank', title: 'xGF' },
    { colName: 'ev_xGARank', title: 'xGA' },
    { colName: 'gsaxRank', title: 'GSAx' },
    { colName: 'finishingRank', title: 'Finish' },
    { colName: 'ppRank', title: 'PP' },
    { colName: 'pkRank', title: 'PK' },
  ];

  ngAfterViewInit(): void {
    this.team$ = this.route.params.pipe(
      switchMap((params) => {
        const teamId = params['teamID'];
        if (teamId >= 1 && teamId <= 32) {
          // Check if teamId is valid
          return this.teamSvc.getTeam(teamId);
        } else {
          return throwError('Invalid team ID'); // throw an error if teamId is invalid
        }
      }),
      catchError((error) => {
        this.router.navigate(['/404']);
        return EMPTY;
      }),
      tap((team) => {
        if (team) {
          this.navColor = team.primaryColor; // diff solution than the dict lookup in cards.component
          this.secondaryColor = team.secondaryColor;
        }
      })
    );

    this.standings$ = this.route.params.pipe(
      switchMap((params) => {
        const teamId = params['teamID'];
        if (teamId >= 1 && teamId <= 32) {
          return this.teamSvc.getStandings(teamId);
        } else {
          return throwError('Invalid team ID');
        }
      })
    );

    this.roster$ = this.route.params.pipe(
      switchMap((params) => {
        const teamId = params['teamID'];
        if (teamId >= 1 && teamId <= 32) {
          return this.teamSvc.getRoster(teamId);
        } else {
          return throwError('Invalid team ID');
        }
      }),
      tap((roster) => {
        if ('goalies' in roster) {
          this.goalies = roster['goalies'] as RosterModel;
          this.goalies.sort(
            (a: { sweaterNumber: number }, b: { sweaterNumber: number }) =>
              a.sweaterNumber - b.sweaterNumber
          );
        }
        if ('forwards' in roster) {
          this.forwards = roster['forwards'] as RosterModel;
          this.forwards.sort(
            (a: { sweaterNumber: number }, b: { sweaterNumber: number }) =>
              a.sweaterNumber - b.sweaterNumber
          );
        }
        if ('defense' in roster) {
          this.defense = roster['defense'] as RosterModel;
          this.defense.sort(
            (a: { sweaterNumber: number }, b: { sweaterNumber: number }) =>
              a.sweaterNumber - b.sweaterNumber
          );
        }
      })
    );

    this.teamCard$ = this.route.params.pipe(
      switchMap((params) => {
        const teamId = params['teamID'];
        if (teamId >= 1 && teamId <= 32) {
          return this.teamSvc.getTeamCard(teamId);
        } else {
          return throwError('Invalid team ID');
        }
      })
    );
  }

  getRankList(teamCard: TeamCardModel): { title: string; color: string }[] {
    const rankList: { title: string; color: string }[] = [];

    /* this might be one of the weirdest bugs I've seen
      Filter does some sort of optimization to end the code early, and that means
      that only having 1, 2, 3 in the array will return false, even if the value is 1, 2, or 3
      it's "fixed" by adding a 4 to the end
    */
    const filteredRanks = this.rankProperties.filter((prop) => {
      return Number(teamCard[prop.colName]) in [1, 2, 3, 4];
    });

    const rankValues = filteredRanks.map((prop) => ({
      title: prop.title,
      color: this.getRankColor(teamCard[prop.colName]),
    }));

    rankList.push(...rankValues); // Add other ranks (optional)
    return rankList;
  }

  getBkgColor(rank: number): { background: string; color: string } {
    const percentile = 100 - (rank / this.totalTeams) * 100;
    return this.getPercentileColor(percentile);
  }

  getPercentileColor(percentile: number): {
    background: string;
    color: string;
  } {
    // borrowed from neil's standings.component.ts
    // feels like it'd be better to have a package for color gradients since this is used in multiple places & the text-color changing is a bit hacky
    if (percentile === 0) {
      return { background: 'blue', color: 'white' };
    } else if (percentile === 100) {
      return { background: 'red', color: 'white' };
    } else if (percentile <= 50) {
      const blueValue = Math.round(percentile * 5.1);
      const background = `rgb(${blueValue}, ${blueValue}, 255)`;
      if (percentile <= 10) {
        return { background, color: 'white' };
      }
      return { background, color: 'black' };
    } else {
      const redValue = Math.round(255 - (percentile - 50) * 5.1);
      const greyValue = Math.round(255 - (percentile - 50) * 5.1);
      const background = `rgb(255, ${greyValue}, ${redValue})`;
      if (percentile >= 90) {
        return { background, color: 'white' };
      }
      return { background, color: 'black' };
    }
  }

  getRankColor(rank: number): string {
    switch (rank) {
      case 1:
        return '#ffbf00';
      case 2:
        return '#b6b5b8';
      case 3:
        return '#cd7f32';
      default:
        return 'white';
    }
  }

  // tooltip text with mappings to the column names
  tooltipMappings: { [key: string]: string } = {
    roster:
      'Live rosters from NHL API. IR/LTIR players are included since they remain on the NHL roster.',
    standings: 'Standings data from NHL API.',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || ''; // return the tooltip text if it exists, otherwise return an empty string
  }

  getPostfix(rank: number | undefined): string {
    if (rank === undefined) {
      return '';
    }

    const rankModTen = rank % 10;
    if (rankModTen == 1) {
      return rank + 'st';
    } else if (rankModTen == 2) {
      return rank + 'nd';
    } else if (rankModTen == 3) {
      return rank + 'rd';
    } else {
      return rank + 'th';
    }
  }

  getSweaterNumber(num: number): string {
    if (num === undefined) {
      return '__';
    }
    if (num < 10) {
      // this bugs me that they don't align properly
      return '  ' + num;
    }
    return num.toString();
  }

  roundNumber(number: number | undefined, decimalPlaces: number): number {
    if (number === undefined) {
      return 0;
    }

    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

  percentNumber(number: number | undefined, decimalPlaces: number): number {
    if (number === undefined) {
      return 0;
    }
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * 100 * factor) / factor;
  }

  hyphenate(season: number): string {
    const seasonStr = season.toString();
    // Return the hyphenated season string
    const year = seasonStr.slice(0, 4);
    const nextYear = seasonStr.slice(4, 8);
    return `${year}-${nextYear}`;
  }
}
