import { Component, AfterViewInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { TeamModel } from 'src/models/team.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
declare var gtag: Function; // Declare the gtag function

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


    public team$: Observable<TeamModel | null>;

    ngOnInit(): void {
        gtag('config', 'G-9DLYWS6ZQV', {
          page_path: window.location.pathname,
        });
      }

    ngAfterViewInit(): void {
        this.team$ = this.route.params.pipe(
            switchMap((params) => {
                const teamId = params['teamId'];
                return this.teamSvc.getTeam(teamId);
            })
        );
    }

}
