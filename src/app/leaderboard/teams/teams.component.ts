import {
  filtersDefault,
  FiltersComponent,
} from '../../filters/filters.component';
import { PlayersService } from '../../services/players.service';
import { SeasonService } from '../../services/season.service';
import { combineLatest, startWith, switchMap } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import { TeamLeaderboardModel } from 'src/models/team-leaderboard.model';

import * as chroma from 'chroma-js';

@Component({
  selector: 'teamsLeaderboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsLeaderboard implements OnInit {
  sortedColumn: string = 'points'; // no clue why this doesn't work
  dataSource = new MatTableDataSource();
  allPlayers = new MatTableDataSource();
  season = '2024';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(FiltersComponent) filters: FiltersComponent;
  //   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sortDefault: Sort = { active: 'points', direction: 'desc' };

  // this is the only thing that matters for col order in the table, not the html order
  displayedColumns: string[] = [
    'teamName',
    'season',
    'gamesPlayed',
    'points',
    'wins',
    'losses',
    'otl',
    'ev_xGF',
    'ev_xGA',
    'finishing',
    'xGPercentage',
    'gsax',
    'pp',
    'pk',
  ];

  constructor(
    private playersService: PlayersService,
    private seasonService: SeasonService
  ) {}

  ngOnInit(): void {
    this.playersService
      .getTeamLeaderboard(filtersDefault, this.sortDefault)
      .subscribe((teams) => (this.dataSource.data = teams));

    // this is what gives me the paging functionality
    // all the player data gets loaded (obv less than ideal)
    // but the act of flipping through the pages allows it more time to load.

    // again, ideally we'd load the data in chunks in sync with the pages, but it'll do for now
    // this.dataSource.paginator = this.paginator;

    // don't feel like this is working
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.seasonService.selectedSeason$.subscribe((season) => {
      this.season = season;
    });

    const filters$ = this.filters?.filtersUpdated.pipe(
      startWith(filtersDefault)
    );

    combineLatest([filters$])
      .pipe(
        switchMap(([filters]) =>
          this.playersService.getSkaterLeaderboard(filters, this.sortDefault)
        )
      )
      .subscribe((players) => (this.dataSource.data = players));
  }

  getCellColors(stat: number, statName: string) {
    const values = (this.allPlayers.data as any[]).map(
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
    wins: 'Regulation Wins',
    losses: 'Regulation Losses',
    otl: 'Overtime Losses',
    points: 'Total Points',
    ev_xGF: 'Expected Goals For per 60 Minutes at Even Strength',
    ev_xGA: 'Expected Goals Against per 60 Minutes at Even Strength',
    xgPercent: 'Expected Goals Percentage',
    finishing: 'Finishing Measured in Goals Saved Above Expected (GSAE)',
    gsax: 'Goals Saved Above Expected (GSAE)',
    pp: 'Power Play Percentage',
    pk: 'Penalty Kill Percentage',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || ''; // return the tooltip text if it exists, otherwise return an empty string
  }

  roundValue(value: number): number {
    return Math.round(value);
  }

  roundDecimal(value: number): number {
    return Math.round(value * 100) / 100;
  }

  percentNumber(number: number | undefined, decimalPlaces: number): number {
    if (number === undefined) {
      return 0;
    }
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * 100 * factor) / factor;
  }

  hyphenate(season: number): string {
    const seasonStr = season.toString();
    // Return the hyphenated season string
    const year = seasonStr.slice(0, 4);
    const nextYear = seasonStr.slice(4, 8);
    return `${year}-${nextYear}`;
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
}