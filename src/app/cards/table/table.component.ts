import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { ShotModel } from 'src/models/shot.model';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'shot-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnChanges {
  @Input() shotsData: ShotModel[];
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

  filterShots(shots: ShotModel[]): ShotModel[] {
    return shots
      .filter((shot) => shot.Outcome == 'goal')
      .map((shot) => {
        if (shot.away_team.slice(0, 3) == 'Mon') {
          shot.away_team = 'MTL';
        }
        if (shot.home_team.slice(0, 3) == 'Mon') {
          shot.home_team = 'MTL';
        }
        return shot;
      });
  }

  getCircleColor(percentile: number): { background: string; color: string } {
    percentile = percentile * 100;
    if (percentile >= 15) {
      return { background: 'red', color: 'white' };
    } else if (percentile <= 5) {
      const blueValue = Math.round(percentile * 5.1);
      const background = `rgb(${blueValue}, ${blueValue}, 255)`;
      return { background, color: 'white' };
    } else {
      return { background: '', color: 'black' };
    }
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
