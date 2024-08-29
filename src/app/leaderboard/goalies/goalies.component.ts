import {
  filtersDefault,
  FiltersComponent,
  Filters,
} from '../../filters/filters.component';
import { PlayersService } from '../../services/players.service';
import { SeasonService } from '../../services/season.service';
import {
  combineLatest,
  map,
  Observable,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';

import * as chroma from 'chroma-js';
import { GoalieModel, setDefaults } from 'src/models/goalie.model';

@Component({
  selector: 'goaliesLeaderboard',
  templateUrl: './goalies.component.html',
  styleUrls: ['./goalies.component.scss'],
})
export class GoaliesLeaderboard implements AfterViewInit, OnInit {
  sortedColumn: string = 'starts';
  dataSource = new MatTableDataSource();

  season = '2024';
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sortDefault: Sort = { active: 'starts', direction: 'desc' };

  allPlayers: Observable<GoalieModel[]>;
  dataSource2: Observable<GoalieModel[]>;

  // this is the only thing that matters for col order in the table, not the html order
  displayedColumns: string[] = [
    'name',
    'position',
    'team',
    'starts',
    'shootout',
    'pk',
    'ev',
  ];

  constructor(
    private playersService: PlayersService,
    private seasonService: SeasonService,
    private filterService: FiltersComponent
  ) {}

  ngOnInit(): void {
    this.allPlayers = this.playersService
      .getGoalieLeaderboard(filtersDefault, this.sortDefault)
      .pipe(
        map((players) => {
          return players.map(setDefaults);
        })
      );

    combineLatest([this.allPlayers, this.filterService.filters$]).pipe(
      map(([players, filters]) => {
        console.warn(filters);
        console.warn(players);
        const filteredPlayers = players.filter((player) => {
          // Apply your filtering logic here based on the filters
          // For example, if you have a filter for team, you can do:
          // return filters.team === player.team;
          // Replace the above line with your actual filtering logic
          return true; // Replace this with your actual filtering logic
        });
        this.dataSource.data = filteredPlayers;
      })
    );

    this.dataSource.paginator = this.paginator;

    // don't feel like this is working
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.seasonService.selectedSeason$.subscribe((season) => {
      this.season = season;
    });

    // this.filters.filtersUpdated.subscribe(console.warn);

    // this.dataSource2 = this.filters.filtersUpdated.pipe(
    //   switchMap(
    //     (filters) =>
    //       this.playersService
    //         .getGoalieLeaderboard(filters, this.sortDefault)
    //         .pipe(
    //           map((goalies) => {
    //             return goalies.map(setDefaults);
    //           })
    //         )
    //     //.subscribe((goalies) => (this.dataSource.data = goalies))
    //   )
    // );
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

  // tooltip text with mappings to the column names - REPLACE WITH GOALIE TOOLTIPS
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
