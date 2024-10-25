import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PlayersService } from '../services/players.service';
import { GoalModel } from 'src/models/goal.model';
import * as chroma from 'chroma-js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PlayerModel } from 'src/models/player.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  switchMap,
} from 'rxjs';
import { Filters } from '../services/leaderboard.service';
import { ScoresService } from '../services/scores.service';
import { StandingsModel } from 'src/models/standings.model';
import { availableSeasons } from '../utils';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  dataSource = new MatTableDataSource<GoalModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  goals: GoalModel[];
  defaultYear = ['2025'];
  videoLink: SafeResourceUrl | null = null;
  filterForm: FormGroup;
  filters: Filters = new Filters();
  players: PlayerModel[] = [];
  filteredPlayers: PlayerModel[] = [];
  selectedPlayers: PlayerModel[] = [];
  teams$: Observable<StandingsModel[]>;
  years = availableSeasons;
  shotTypes = [
    'snap',
    'wrist',
    'poke',
    'tip-in',
    'backhand',
    'slap',
    'deflected',
    'bat',
    'wrap-around',
    'cradle',
    'between-legs',
  ];
  strengths = ['EV', 'Powerplay', 'Shorthanded'];

  searchControl = new FormControl();

  constructor(
    private router: Router,
    private svc: PlayersService,
    private scoresSvc: ScoresService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filters.season = '2025';
    this.svc.getGoalData().subscribe((goals) => {
      this.goals = goals;
      this.updateDataSource();
    });
    this.filterForm = this.fb.group({
      year: [2025],
      players: [[]],
      teamNames: [[]],
      shotType: [[]],
      strength: [[]],
    });

    this.svc.getName(this.filters).subscribe((players) => {
      this.players = players;
      this.filteredPlayers = players;
    });

    this.filterForm.get('year')?.valueChanges.subscribe((newYear) => {
      this.filters.season = newYear;
      this.svc.getName(this.filters).subscribe((players) => {
        this.players = players;
        this.filteredPlayers = players;
      });
    });

    this.teams$ = this.scoresSvc.getStandings();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(
          (searchText: string | null): searchText is string =>
            searchText !== null
        ),
        switchMap(() => this.svc.getName(this.filters))
      )
      .subscribe((players: PlayerModel[]) => {
        this.players = players;
        this.onSearchInputChange();
      });
  }

  onSubmit() {
    const filters = this.filterForm.value;
    this.svc
      .getGoalData(
        filters.players,
        filters.teamNames,
        filters.shotType,
        filters.strength,
        filters.year
      )
      .subscribe((goals) => {
        this.goals = goals;
        this.updateDataSource();
      });
  }

  openVideo(link: string) {
    if (link !== 'No link found.') {
      this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }
  }

  getSelectedPlayerNames(): string[] {
    const selectedIds = this.filterForm.get('players')?.value;
    const selectedPlayers = this.players.filter((player) =>
      selectedIds.includes(player.playerID)
    );
    return selectedPlayers.map(
      (player) => `${player.firstName} ${player.lastName}`
    );
  }

  onSearchInputChange() {
    const searchTerm = this.searchControl.value.toLowerCase();
    if (searchTerm) {
      this.filteredPlayers = this.players.filter(
        (player) =>
          player.firstName.toLowerCase().includes(searchTerm) ||
          player.lastName.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredPlayers = this.players;
    }
  }

  selectPlayer(player: PlayerModel) {
    this.selectedPlayers.push(player);
    this.filterForm.get('players')!.setValue(this.selectedPlayers);
    this.clearSearchInput();
  }

  clearSearchInput() {
    this.searchControl.setValue('');
    this.filteredPlayers = [];
  }

  closeVideo() {
    this.videoLink = null;
  }

  getBkgColor(percentile: number): { background: string; color: string } {
    percentile = percentile * 100;
    let textColor = 'black';

    if (percentile <= 10) {
      return { background: '#ffffff', color: textColor };
    }

    const gradient = chroma
      .scale(['#7ecef9', '#0000ff'])
      .mode('lab')
      .colors(10);

    const val = Math.floor(percentile / 10);

    return { background: gradient[val], color: textColor };
  }

  redirectToLink(link: string) {
    if (link != 'No link found.') {
      if (link.slice(-4) == 'm3u8') {
        const urlTree = this.router.createUrlTree(['/video', link]);
        const url = this.router.serializeUrl(urlTree);
        window.open(url, '_blank');
      } else {
        window.open(link, '_blank');
      }
    }
  }

  roundValue(xG: number) {
    return Math.round(xG * 100) / 100;
  }

  tooltipMappings: { [key: string]: string } = {
    xg: 'Expected Goals',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || '';
  }

  private updateDataSource(): void {
    this.dataSource.data = this.goals;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
