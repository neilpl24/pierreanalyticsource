import { Component, AfterViewInit } from '@angular/core';
import { ScoresService } from '../services/scores.service';
import { StandingsModel } from 'src/models/standings.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as chroma from 'chroma-js';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements AfterViewInit {
  public standings: StandingsModel[];
  divisions = ['Metropolitan', 'Atlantic', 'Pacific', 'Central'];
  lastUpdated: string;

  constructor(
    private scoresService: ScoresService,
    private datePipe: DatePipe
  ) {}

  ngAfterViewInit(): void {
    this.getStandingsAndGroupByDivision();
  }

  getStandingsAndGroupByDivision() {
    this.scoresService
      .getStandings()
      .pipe(
        switchMap((standings) => {
          this.standings = standings;
          if (this.standings && this.standings.length > 0) {
            this.lastUpdated = this.formatLastUpdated(standings[0].lastUpdated);
          }
          return this.groupByDivision(this.divisions[0]);
        })
      )
      .subscribe();
  }

  formatLastUpdated(date: string): string {
    return this.datePipe.transform(date, 'MM/dd/yy, h:mma') || '';
  }

  groupByDivision(division: string): StandingsModel[] {
    if (this.standings) {
      return this.standings
        .filter((team) => team.division === division)
        .sort((a, b) => b.actualPoints - a.actualPoints);
    } else {
      return [];
    }
  }
  calculatePercentile(arr: number[], val: number) {
    return (
      (100 *
        arr.reduce(
          (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
          0
        )) /
      arr.length
    );
  }

  getActualPointsStyle(actualPoints: number): { [key: string]: string } {
    const percentile = this.calculatePercentile(
      this.standings.map((team) => team.actualPoints),
      actualPoints
    );
    return this.getBkgColor(percentile);
  }

  getBkgColor(percentile: number): { background: string; color: string } {
    const gradient = chroma
      .scale(['#c70039', '#ff5722', '#ffffff', '#7ecef9', '#007bff'])
      .mode('lab')
      .padding(0.1)
      .colors(100);

    var textColor = 'black';

    const val = Math.round(percentile);

    return { background: gradient[val], color: textColor };
  }
}
