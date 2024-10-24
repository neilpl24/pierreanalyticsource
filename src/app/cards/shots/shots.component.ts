import {
  Component,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { ShotModel } from 'src/models/shot.model';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { RinkMap } from './rinkPlot.js';
import { BehaviorSubject, Subscription } from 'rxjs';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'shots',
  templateUrl: './shots.component.html',
  styleUrls: ['./shots.component.css'],
})
export class ShotsComponent implements OnInit {
  @Input() shotsData: ShotModel[];

  private filteredShotsSubject = new BehaviorSubject<ShotModel[]>([]);
  filteredShots$ = this.filteredShotsSubject.asObservable();

  selectedOptions: Set<string> = new Set(['EV', 'SH', 'PP']);

  shotsLayer: any;

  rinkScale: number;
  rinkWidth: number;

  constructor(private router: Router) {}

  ngOnInit() {
    this.createChart();
    this.filterShotsData();

    this.filteredShots$
      .pipe(
        tap((filteredShots) => {
          this.updateVisualization(filteredShots);
        })
      )
      .subscribe();
  }

  createChart() {
    const container = document.getElementById('half-rink-vert');
    if (container) {
      var halfVertSvg = d3
        .select('#half-rink-vert')
        .append('svg')
        .attr('width', 300)
        .attr('height', 400);

      const halfVertPlot = RinkMap({
        parent: halfVertSvg,
        halfRink: true,
        desiredWidth: 300,
        horizontal: false,
      });

      this.rinkScale = halfVertPlot.rinkScale;
      this.rinkWidth = halfVertPlot.rinkWidth;
      halfVertPlot.chart();

      this.shotsLayer = halfVertSvg.append('g').attr('id', 'shotsLayer');
    }
  }

  toggleSelection(option: string) {
    if (this.selectedOptions.has(option)) {
      this.selectedOptions.delete(option);
    } else {
      this.selectedOptions.add(option);
    }

    this.filterShotsData();
  }

  isSelected(option: string) {
    return this.selectedOptions.has(option);
  }

  filterShotsData() {
    const filteredShots = this.shotsData.filter((shot) => {
      const strength = strengthSwitch(shot.strength);
      return this.selectedOptions.has(strength);
    });

    this.filteredShotsSubject.next(filteredShots);
  }

  scaleRink(nhlX: number, nhlY: number) {
    // will need a bit different logic for the full rink
    // since there will be another zone of data
    // TODO: check passing of the shots data - moving from one player to the next doesn't update it.
    if (nhlX >= 0) {
      return {
        x: nhlX * this.rinkScale,
        y: this.rinkWidth / 2 + nhlY * this.rinkScale,
      };
    } else {
      return {
        x: Math.abs(nhlX) * this.rinkScale,
        y: this.rinkWidth / 2 + nhlY * this.rinkScale,
      };
    }
  }

  updateVisualization(filteredShots: ShotModel[]) {
    // heuristic id function to update the circles
    const keyFunction = (d: ShotModel) =>
      `${d.date}${d.shooter_id}${d.away_goals}${d.home_goals}`;

    const circles = this.shotsLayer
      .selectAll('circle')
      .data(filteredShots, keyFunction as any);

    circles
      .enter()
      .append('circle')
      .attr('cx', (d: ShotModel) => this.scaleRink(d.x, d.y).y)
      .attr('cy', (d: ShotModel) => this.scaleRink(d.x, d.y).x)
      .attr('r', 0) // Start with radius 0 for transition
      .attr('fill', (d: ShotModel) =>
        d.hasLink ? 'lightskyblue' : 'lightgrey'
      )
      .attr('stroke', '#24668f')
      .transition() // Add transition
      .duration(300)
      .attr('r', 5); // Transition to radius 5

    circles.exit().transition().duration(300).attr('r', 0).remove();

    const tooltip = d3
      .select('body')
      .append('div')
      .style('opacity', 0)
      .style('background-color', '#87cefa')
      .style('color', '#000')
      .style('border', '2px solid #24668f')
      .style('border-radius', '5px')
      .style('text-align', 'center')
      .style('padding', '8px')
      .style('position', 'absolute');

    this.shotsLayer
      .selectAll('circle')
      .on('mouseover', function (event: any, d: ShotModel) {
        const shot = d as ShotModel;
        tooltip.transition().duration(200).style('opacity', 1);

        tooltip
          .html(
            'Strength: ' +
              shot.strength +
              '<br>Goal Type: ' +
              shot.type +
              '<br>xG: ' +
              shot.xG
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('click', function (d: ShotModel) {
        const shot = d as ShotModel;
        if (shot.Link != 'No link found.') {
          window.open(shot.Link, '_blank');
        }
      });
  }
}

function strengthSwitch(strength: string) {
  // doing this to match with the data coming out of the shot model
  switch (strength) {
    case 'Powerplay':
      return 'PP';
    case 'Shorthanded':
      return 'SH';
    case 'EV':
      return 'EV';
    default:
      return strength;
  }
}
