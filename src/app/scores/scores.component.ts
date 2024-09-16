import { Component, AfterViewInit } from '@angular/core';
import { ScoresService } from '../services/scores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { ScoreCardModel } from 'src/models/game.model';
import { DateLeaderboardModel } from 'src/models/date-leaderboard.model';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss'],
})
export class ScoresComponent implements AfterViewInit {
  selectedDate: string;
  isLoading = true;
  public scores$: Observable<ScoreCardModel[]>;
  public bestxGPlayer: DateLeaderboardModel;
  public worstxGPlayer: DateLeaderboardModel;
  public bestGoaliePlayer: DateLeaderboardModel;
  public bestxGs: DateLeaderboardModel[];
  public worstxGs: DateLeaderboardModel[];
  public bestGoalies: DateLeaderboardModel[];
  public worstGoalies: DateLeaderboardModel[];
  public worstGoaliePlayer: DateLeaderboardModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scoresService: ScoresService
  ) {}

  ngAfterViewInit(): void {
    this.scores$ = this.route.params.pipe(
      switchMap((params) => {
        const date = params['date'];
        this.selectedDate = date;
        this.scoresService
          .getDateData(date.toString().slice(0, 4), date)
          .pipe(
            catchError(() => {
              this.router.navigate(['/404']);
              return of(null);
            })
          )
          // TODO refactor this mess
          .subscribe((data: any) => {
            if (!data || data.length == 0) {
              this.router.navigate(['/404']);
            } else {
              this.bestxGs = data.bestxGs;
              this.bestxGPlayer = data.bestxGs[0];
              this.worstxGs = data.worstxGs;
              this.worstxGPlayer = data.worstxGs[0];
              this.bestGoalies = data.bestGoalies;
              this.bestGoaliePlayer = data.bestGoalies[0];
              this.worstGoalies = data.worstGoalies;
              this.worstGoaliePlayer = data.worstGoalies[0];
              this.isLoading = false;
            }
          });
        return this.scoresService.getGames(date);
      })
    );
  }

  // navToGameCard(event: Event, gamePk: number) {
  //   this.scoresService
  //     .getGameData('2023', gamePk.toString())
  //     .subscribe((game) => {
  //       console.log(game);
  //     });
  // }
}
