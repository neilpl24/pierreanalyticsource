import { Component, AfterViewInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { TeamModel } from 'src/models/team.model';
import { Observable } from 'rxjs';
import { switchMap, tap, catchError} from 'rxjs/operators';
import { of, EMPTY, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamStandingsModel } from 'src/models/team-standings.model';
import { RosterModel } from 'src/models/roster.model';



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
  public standings$: Observable<TeamStandingsModel | null>;
  public roster$: Observable<RosterModel[] | null>;

  goalies: any;
  forwards: any;
  defense: any;

  ngAfterViewInit(): void {
    this.team$ = this.route.params.pipe(
        switchMap((params) => {
            const teamId = params['teamID'];
            if (teamId >= 1 && teamId <= 32) { // Check if teamId is valid
                return this.teamSvc.getTeam(teamId);
            } else {
                return throwError("Invalid team ID"); // throw an error if teamId is invalid
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
                return throwError("Invalid team ID");
            }

        })
      );

      this.roster$ = this.route.params.pipe(
        switchMap((params) => {
            const teamId = params['teamID'];
            if (teamId >= 1 && teamId <= 32) {
                return this.teamSvc.getRoster(teamId);
            } else {
                return throwError("Invalid team ID");
            }

        }), tap((roster) => {
            //this.goalies = new MatTableDataSource(roster["goalies"] as RosterModel);
            if ("goalies" in roster) {
                this.goalies = (roster["goalies"]) as RosterModel;
            }

            if ("forwards" in roster) {
                this.forwards = (roster["forwards"]) as RosterModel;
            }

            if ("defense" in roster) {
                this.defense = (roster["defense"]) as RosterModel;
            }
            //this.goalies = roster[0];

        })
      );
  }
}
