import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { ReleaseNoteModel } from 'src/models/release-note.model';
import { map, Observable, tap } from 'rxjs';
import { ScoreCardModel, setDefaults } from 'src/models/game.model';
import { ScoresService } from '../services/scores.service';
import { ActivatedRoute } from '@angular/router';
import { PlayersService } from '../services/players.service';
import { PlayerModel } from 'src/models/player.model';

declare var gtag: Function; // Declare the gtag function

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnInit {
  public releaseNotes$: Observable<ReleaseNoteModel[]>;
  public scores$: Observable<ScoreCardModel[]>;
  public luckyPlayer$: Observable<PlayerModel>;
  public imageMap: { [key: string]: string } = {
    'Bennett Summy': 'bennett-alt.jpg',
    'Neil Pierre-Louis': 'neil-alt.png',
  };

  constructor(
    private teamSvc: TeamsService,
    private scoresService: ScoresService,
    private playersService: PlayersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // what does this do?
    gtag('config', 'G-9DLYWS6ZQV', {
      page_path: window.location.pathname,
    });

    this.releaseNotes$ = this.teamSvc.getReleaseNotes();

    this.scores$ = this.scoresService.getGames().pipe(
      map((scores) => {
        return scores.map(setDefaults);
      })
    );

    this.luckyPlayer$ = this.playersService.getLuckyPlayer();
  }

  ngAfterViewInit(): void {}
}
