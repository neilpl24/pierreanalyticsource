import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {
  combineLatest,
  first,
  map,
  Observable,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { PlayersService } from '../../services/players.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SeasonService } from '../../services/season.service';
import * as chroma from 'chroma-js';
import { PlayerModel, setDefaults } from 'src/models/player.model';
import { MatSidenav } from '@angular/material/sidenav';
import {
  LeaderboardService,
  filtersDefault,
} from 'src/app/services/leaderboard.service';

@Component({
  selector: 'skatersLeaderboard',
  templateUrl: './skaters.component.html',
  styleUrls: ['./skaters.component.scss'],
})
export class SkatersLeaderboard implements OnInit, AfterViewInit {
  sortedColumn: string = 'goals';
  dataSource = new MatTableDataSource();
  season = '2024';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sortDefault: Sort = { active: 'goals_60', direction: 'desc' };

  allPlayers: Observable<PlayerModel[]>;

  // this is the only thing that matters for col order in the table, not the html order
  displayedColumns: string[] = [
    'name',
    'position',
    'team',
    'goals',
    'finishing',
    'primaryAssistsEV',
    'xGPercentage',
    'xGF',
    'xGA',
  ];

  constructor(
    private playersService: PlayersService,
    private seasonService: SeasonService,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit(): void {
    this.allPlayers = this.playersService
      .getSkaterLeaderboard(filtersDefault, this.sortDefault)
      .pipe(
        map((players) => {
          const processedPlayers = players.map(setDefaults);
          this.generateFilterOptions(processedPlayers);
          return processedPlayers;
        })
      );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.seasonService.selectedSeason$.subscribe((season) => {
      this.season = season;
    });

    combineLatest([this.allPlayers, this.leaderboardService.filters$])
      .pipe(
        map(([players, filters]) => {
          const filteredPlayers = players.filter((player) => {
            // Apply filtering logic based on the filters
            if (
              filters.nationality.length > 0 &&
              !filters.nationality.includes(player.nationality)
            ) {
              return false;
            }
            if (
              filters.position.length > 0 &&
              !filters.position.includes(player.position)
            ) {
              return false;
            }
            if (
              filters.searchText &&
              !player.firstName
                .toLowerCase()
                .includes(filters.searchText.toLowerCase()) &&
              !player.lastName
                .toLowerCase()
                .includes(filters.searchText.toLowerCase())
            ) {
              return false;
            }

            if (
              filters.team.length > 0 &&
              !filters.team.includes(player.team)
            ) {
              return false;
            }
            return true;
          });
          this.dataSource.data = filteredPlayers;
        })
      )
      .subscribe();
  }

  generateFilterOptions(players: PlayerModel[]) {
    const positions = [...new Set(players.map((player) => player.position))];
    const nationalities = [
      ...new Set(players.map((player) => player.nationality)),
    ];
    const teams = [...new Set(players.map((player) => player.team))];

    this.leaderboardService.setAvailableFilters(
      positions,
      nationalities,
      teams
    );
  }

  getCellColors(stat: number, statName: string) {
    const values = (this.dataSource.data as any[]).map(
      (data) => data[statName]
    );
    let percentile = this.calculatePercentile(stat, values);
    if (statName == 'xGA') {
      percentile = 100 - percentile;
    }
    return this.getBkgColor(percentile, statName);
  }

  // tooltip text with mappings to the column names
  tooltipMappings: { [key: string]: string } = {
    goals: 'Even Strength Goals per 60 Minutes',
    finishing: 'Finishing Measured in Goals Saved Above Expected (GSAE)',
    assists: 'Even Strength Primary Assists per 60 Minutes',
    xgPercent: 'Expected Goals Percentage',
    xgf: 'Expected Goals For per 60 Minutes',
    xga: 'Expected Goals Against per 60 Minutes',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || ''; // return the tooltip text if it exists, otherwise return an empty string
  }

  onSortChange(event: Sort) {
    this.sortedColumn = event.active;
  }

  calculatePercentile(value: number, values: number[]): number {
    const percentile = (arr: number[], val: number) => {
      let count = 0;
      arr.forEach((v) => {
        if (v < val) {
          count++;
        } else if (v == val) {
          count += 0.5;
        }
      });
      return (100 * count) / arr.length;
    };
    return percentile(values, value);
  }

  getBkgColor(
    percentile: number,
    column: string
  ): { background: string; color: string } {
    if (column !== this.sortedColumn) {
      return { background: '', color: '' };
    }
    const gradient = chroma
      .scale(['#c70039', '#ff5722', '#ffffff', '#7ecef9', '#007bff'])
      .mode('lab')
      .padding(0.1)
      .colors(100);

    var textColor = 'black';

    const val = Math.floor(percentile);

    return { background: gradient[val], color: textColor };
  }

  getPlayerPosition(position: string): string {
    switch (position) {
      case 'L':
        return 'LW';
      case 'R':
        return 'RW';
      default:
        return position;
    }
  }
}
