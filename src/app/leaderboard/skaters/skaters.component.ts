import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { combineLatest, first, startWith, switchMap } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { PlayersService } from '../../services/players.service';
import {
  filtersDefault,
  FiltersComponent,
  Filters,
} from '../../filters/filters.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SeasonService } from '../../services/season.service';

import * as chroma from 'chroma-js';

@Component({
  selector: 'skatersLeaderboard',
  templateUrl: './skaters.component.html',
  styleUrls: ['./skaters.component.scss'],
})
export class SkatersLeaderboard implements OnInit, AfterViewInit {
  sortedColumn: string = 'goals';
  dataSource = new MatTableDataSource();
  allPlayers = new MatTableDataSource();
  season = '2024';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(FiltersComponent) filters: FiltersComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sortDefault: Sort = { active: 'goals_60', direction: 'desc' };

  currentFilters: Filters = filtersDefault;

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
    private filtersComponent: FiltersComponent
  ) {}

  ngOnInit(): void {
    this.filtersComponent.filtersUpdated.subscribe((filters) => {
      this.currentFilters = filters;
      console.log('Received filters:', this.currentFilters);
      // Use the filters data here (e.g., call an API with filters)
    });

    // calling the fetchSkaterLeaderboard function to get the data
    this.playersService
      .getSkaterLeaderboard(filtersDefault, this.sortDefault)
      .subscribe((players) => (this.dataSource.data = players));

    // this is what gives me the paging functionality
    // all the player data gets loaded (obv less than ideal)
    // but the act of flipping through the pages allows it more time to load.

    // again, ideally we'd load the data in chunks in sync with the pages, but it'll do for now
    this.dataSource.paginator = this.paginator;

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

  roundValue(value: number): number {
    return Math.round(value);
  }

  roundDecimal(value: number): number {
    return Math.round(value * 100) / 100;
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
