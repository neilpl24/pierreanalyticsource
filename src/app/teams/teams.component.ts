import { Component, AfterViewInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { TeamModel } from 'src/models/team.model';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';




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

  public team$: Observable<TeamModel | null>;

  ngAfterViewInit(): void {
    this.team$ = this.route.params.pipe(
        switchMap((params) => {
            const teamId = params['teamID'];
            return this.teamSvc.getTeam(teamId);
        }),
        tap((team) => {
            if (!team) { // need to make sure this works
                this.router.navigate(['/404']);
            } else {
                this.navColor = team.teamPrimaryColor; // diff solution than the dict lookup in cards.component
            }
        })
    );
  }
}
