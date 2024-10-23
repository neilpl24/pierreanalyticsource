import {
  Component,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnInit,
  Input,
} from '@angular/core';
import { ShotModel } from 'src/models/shot.model';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { RinkMap } from './rinkPlot.js';

// add more to this as we go
const CONFIG = {
  RINK_PADDING: 5,
  RINK_LENGTH: 200,
  RINK_WIDTH: 85,
  BOARDS_RADIUS: 10,
  BOARDS_WIDTH: 2,
  LINES_WIDTH: 1.8,
  NEUTRAL_ZONE_WIDTH: 50,
  BOARDS_TO_GOAL_LINE: 16,
  // could move this to it's own object
  BOARDS_COLOR: 'black',
  RED_LINE: 'red',
  BLUE_LINE: 'blue',
  RINK_FILL: 'white',
  GOAL_FILL: 'lightblue',
};

@Component({
  selector: 'shots',
  templateUrl: './shots.component.html',
  styleUrls: ['./shots.component.css'],
})
export class ShotsComponent implements AfterViewInit {
  @Input() shotsData: ShotModel[];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const container = document.getElementById('half-rink-vert');
    if (container) {
      // leave the rink itself as a separate function
      var halfVertSvg = d3
        .select('#half-rink-vert')
        .append('svg')
        .attr('width', 500)
        .attr('height', 800);

      const halfVertPlot = RinkMap({
        parent: halfVertSvg,
        halfRink: true,
        desiredWidth: 400,
        horizontal: false,
      });

      const rinkScale = halfVertPlot.rinkScale;
      const rinkWidth = halfVertPlot.rinkWidth;
      halfVertPlot.chart();

      // add the specific purpose later
      // allows for more applications (e.g. half rink, different sizes, heat maps)
      const shotsLayer = halfVertSvg.append('g').attr('id', 'shotsLayer');

      console.warn('shotsData', this.shotsData);

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

      // Create circles for the shots

      shotsLayer
        .selectAll('circle')
        .data(this.shotsData)
        .enter()
        .append('circle')
        .attr('cx', (d) => scaleRink(d.x, d.y, rinkScale, rinkWidth).y)
        .attr('cy', (d) => scaleRink(d.x, d.y, rinkScale, rinkWidth).x)
        .attr('r', 5)
        .attr('fill', 'lightskyblue')
        .attr('stroke', '#24668f') // add in link based coloring
        .on('mouseover', function (event, d) {
          tooltip.transition().duration(200).style('opacity', 1);

          tooltip
            .html(
              'Goal Type: ' +
                d.type +
                '<br>xG: ' +
                d.xG +
                '<br> x: ' +
                d.x +
                '<br> y: ' +
                d.y
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 10 + 'px');
        })
        .on('mouseout', function () {
          tooltip.transition().duration(500).style('opacity', 0);
        });
    }
  }
}

function scaleRink(
  nhlX: number,
  nhlY: number,
  rinkScale: number,
  rinkWidth: number
) {
  // will need a bit different logic for the full rink
  // since there will be another zone of data
  if (nhlX >= 0) {
    return {
      x: nhlX * rinkScale,
      y: rinkWidth / 2 + nhlY * rinkScale,
    };
  } else {
    return {
      x: Math.abs(nhlX) * rinkScale,
      y: rinkWidth / 2 + nhlY * rinkScale,
    };
  }
}
