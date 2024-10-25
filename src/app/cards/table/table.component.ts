import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as chroma from 'chroma-js';
import { GoalModel } from 'src/models/goal.model';

@Component({
  selector: 'shot-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnChanges {
  @Input() shotsData: GoalModel[];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.updateDataSource();
  }

  ngOnChanges(): void {
    this.updateDataSource();
  }

  filterShots(shots: GoalModel[]): GoalModel[] {
    return shots
      .filter((shot) => shot.outcome == 'goal')
      .map((shot) => {
        if (shot.awayTeam.slice(0, 3) == 'Mon') {
          shot.awayTeam = 'MTL';
        }
        if (shot.homeTeam.slice(0, 3) == 'Mon') {
          shot.homeTeam = 'MTL';
        }
        return shot;
      });
  }

  getBkgColor(percentile: number): { background: string; color: string } {
    // the most common xG values are between 0 and 0.1, so we're going to make those white
    // this version will give us 10 colors of blue from there

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

  // tooltip text with mappings to the column names
  tooltipMappings: { [key: string]: string } = {
    xg: 'Expected Goals',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || ''; // return the tooltip text if it exists, otherwise return an empty string
  }

  private updateDataSource(): void {
    this.shotsData = this.filterShots(this.shotsData);
    this.dataSource.data = this.shotsData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
