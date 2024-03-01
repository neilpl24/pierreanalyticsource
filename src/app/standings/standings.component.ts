import { Component, AfterViewInit } from '@angular/core';
import { ScoresService } from '../services/scores.service';
import { StandingsModel } from 'src/models/standings.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements AfterViewInit {
  public standings: StandingsModel[];
  divisions = ['Metropolitan', 'Atlantic', 'Pacific', 'Central'];

  constructor(private scoresService: ScoresService) {}

  ngAfterViewInit(): void {
    this.getStandingsAndGroupByDivision();
  }

  getStandingsAndGroupByDivision() {
    this.scoresService
      .getStandings()
      .pipe(
        switchMap((standings) => {
          this.standings = standings;
          return this.groupByDivision(this.divisions[0]);
        })
      )
      .subscribe();
  }

  groupByDivision(division: string): StandingsModel[] {
    if (this.standings) {
      return this.standings
        .filter((team) => team.Division === division)
        .sort((a, b) => b['Actual Points'] - a['Actual Points']);
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
      this.standings.map((team) => team['Actual Points']),
      actualPoints
    );
    const colors = this.getPercentileColor(percentile);
    return {
      'background-color': colors.background,
      color: colors.text,
    };
  }

  getPercentileColor(percentile: number): { background: string; text: string } {
    if (percentile === 0) {
      return { background: 'blue', text: 'white' };
    } else if (percentile === 100) {
      return { background: 'red', text: 'white' };
    } else if (percentile <= 50) {
      const blueValue = Math.round(percentile * 5.1);
      const background = `rgb(${blueValue}, ${blueValue}, 255)`;
      if (percentile <= 10) {
        return { background, text: 'white' };
      }
      return { background, text: 'black' };
    } else {
      const redValue = Math.round(255 - (percentile - 50) * 5.1);
      const greyValue = Math.round(255 - (percentile - 50) * 5.1);
      const background = `rgb(255, ${greyValue}, ${redValue})`;
      if (percentile >= 90) {
        return { background, text: 'white' };
      }
      return { background, text: 'black' };
    }
  }
}
