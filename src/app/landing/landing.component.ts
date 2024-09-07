import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {
  combineLatest,
  Observable,
  of,
  startWith,
  switchMap,
  filter,
} from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
declare var gtag: Function; // Declare the gtag function
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';
import { PlayerModel } from 'src/models/player.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SeasonService } from '../services/season.service';
import { Filters, filtersDefault } from '../services/leaderboard.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  dataSource = new MatTableDataSource();
  season = '2024';
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public players$: Observable<PlayerModel[]>;

  constructor(
    private playersSvc: PlayersService,
    private readonly router: Router,
    private seasonService: SeasonService
  ) {}

  ngOnInit(): void {
    gtag('config', 'G-9DLYWS6ZQV', {
      page_path: window.location.pathname,
    });
    // this.seasonService.selectedSeason$.subscribe((season) => {
    //   this.season = season;
    //   filtersDefault.season = season;
    // });
  }
}
