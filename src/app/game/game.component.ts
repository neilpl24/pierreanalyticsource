import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { ShotModel } from 'src/models/shot.model';
import { ScoresService } from '../services/scores.service';
import { ScoreCardModel } from 'src/models/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  public shots$: Observable<ShotModel[] | null>;
  public game$: Observable<ScoreCardModel | null>;
  public filteredShots$: ShotModel[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private scoresService: ScoresService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.shots$ = this.route.params.pipe(
      switchMap((params) => {
        const gamePk = params['gamePk'];
        return this.scoresService.getShotData(gamePk).pipe(
          catchError(() => {
            this.router.navigate(['/404']);
            return of(null);
          })
        );
      })
    );
  }

  filterShots(playerID: number) {
    this.shots$.subscribe((shots) => {
      this.filteredShots$ = shots?.filter((shot) => {
        shot.shooter_id = playerID;
      });
    });
  }
}
