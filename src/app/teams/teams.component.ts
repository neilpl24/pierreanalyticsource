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
        }
        if ('forwards' in roster) {
          this.forwards = roster['forwards'] as RosterModel;
        }
        if ('defense' in roster) {
          this.defense = roster['defense'] as RosterModel;
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

  // tooltip text with mappings to the column names
  tooltipMappings: { [key: string]: string } = {
    roster:
      'Live rosters from NHL API. IR/LTIR players are included since they remain on the NHL roster.',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || ''; // return the tooltip text if it exists, otherwise return an empty string
  }

  getRankPostfix(rank: number | undefined): string {
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
}
