import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { combineLatest, startWith, switchMap } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { PlayersService } from '../services/players.service';
import { filtersDefault, FiltersComponent } from '../filters/filters.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SeasonService } from '../services/season.service';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements AfterViewInit, OnInit {
  sortedColumn: string = 'goals';
  dataSource = new MatTableDataSource();
  allPlayers = new MatTableDataSource();
  season = '2024';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(FiltersComponent) filters: FiltersComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private playersSvc: PlayersService,
    private seasonService: SeasonService
  ) {}
  ngOnInit(): void {
    this.seasonService.selectedSeason$.subscribe((season) => {
      this.season = season;
      filtersDefault.season = season;
    });
  }

  ngAfterViewInit(): void {
    this.seasonService.selectedSeason$.subscribe((season) => {
      this.season = season;
    });

    const sortDefault: Sort = { active: 'goals_60', direction: 'desc' };
    const filters$ = this.filters.filtersUpdated.pipe(
      startWith(filtersDefault)
    );

    combineLatest([filters$])
      .pipe(
        switchMap(([filters]) =>
          this.playersSvc.search_no_percentile(filters, sortDefault)
        )
      )
      .subscribe((players) => (this.dataSource.data = players));

    this.playersSvc
      .search_no_percentile(filtersDefault, sortDefault)
      .subscribe((players) => (this.allPlayers.data = players));

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCellColors(stat: number, statName: string) {
    const values = (this.allPlayers.data as any[]).map(
      (data) => data[statName]
    );
    let percentile = this.calculatePercentile(stat, values);
    if (statName == 'xGA') {
      percentile = 100 - percentile;
    }
    return this.getCircleColor(percentile, statName);
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

  getCircleColor(
    percentile: number,
    column: string
  ): { background: string; color: string } {
    if (column !== this.sortedColumn) {
      return { background: '', color: '' };
    }
    if (percentile === 0) {
      return { background: 'blue', color: 'white' };
    } else if (percentile === 100) {
      return { background: 'red', color: 'white' };
    } else if (percentile <= 50) {
      const blueValue = Math.round(percentile * 5.1);
      const background = `rgb(${blueValue}, ${blueValue}, 255)`;
      if (percentile <= 10) {
        return { background, color: 'white' };
      }
      return { background, color: 'black' };
    } else {
      const redValue = Math.round(255 - (percentile - 50) * 5.1);
      const greyValue = Math.round(255 - (percentile - 50) * 5.1);
      const background = `rgb(255, ${greyValue}, ${redValue})`;
      if (percentile >= 90) {
        return { background, color: 'white' };
      }
      return { background, color: 'black' };
    }
  }
}
