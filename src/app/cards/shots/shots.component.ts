import { Component, SimpleChanges, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { RinkMap } from './rinkPlot.js';
import { BehaviorSubject } from 'rxjs';
import { combineLatest, map, tap } from 'rxjs';
import { hexbin } from 'd3-hexbin';
import { GoalModel } from 'src/models/goal.model.js';

@Component({
  selector: 'shots',
  templateUrl: './shots.component.html',
  styleUrls: ['./shots.component.css'],
})
export class ShotsComponent implements OnInit {
  @Input() shotsData: GoalModel[];

  isGoalsToggle: string = 'false';
  private isGoalsSubject = new BehaviorSubject<boolean>(
    this.isGoalsToggle === 'true'
  );
  isGoals$ = this.isGoalsSubject.asObservable();

  isCirclePlotsToggle: string = 'true';
  private isCirclePlotsSubject = new BehaviorSubject<boolean>(
    this.isCirclePlotsToggle === 'true'
  );
  isCirclePlots$ = this.isCirclePlotsSubject.asObservable();

  private filteredShotsSubject = new BehaviorSubject<GoalModel[]>([]);
  filteredShots$ = this.filteredShotsSubject.asObservable();

  selectedOptions: Array<string> = ['EV', 'SH', 'PP'];

  circlesLayer: any;
  hexbinLayer: any;

  rinkScale: number;
  rinkWidth: number;

  constructor(private router: Router) {}

  ngOnInit() {
    this.createChart();
    this.filterShotsData();

    // a change of either observable should trigger the visualization update
    combineLatest([this.filteredShots$, this.isCirclePlots$])
      .pipe(
        tap(([filteredShots, isCirclePlots]) => {
          this.updateVisualization(filteredShots, isCirclePlots);
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shotsData']) {
      if (this.circlesLayer && this.hexbinLayer) {
        this.circlesLayer.selectAll('circle').remove();
        this.hexbinLayer.selectAll('path').remove();
      }

      // Filter the new shots data
      this.filterShotsData();
    }
  }

  createChart() {
    const container = document.getElementById('half-rink-vert');
    if (container) {
      var halfVertSvg = d3
        .select('#half-rink-vert')
        .append('svg')
        .attr('width', 300)
        .attr('height', 355);

      const halfVertPlot = RinkMap({
        parent: halfVertSvg,
        halfRink: true,
        desiredWidth: 300,
        horizontal: false,
      });

      this.rinkScale = halfVertPlot.rinkScale;
      this.rinkWidth = halfVertPlot.rinkWidth;
      halfVertPlot.chart();

      // just create both layers, even if we're not using it
      this.circlesLayer = halfVertSvg.append('g').attr('id', 'circlesLayer');
      this.hexbinLayer = halfVertSvg.append('g').attr('id', 'hexbinLayer');
    }
  }

  toggleSelection(option: string) {
    // has to be an array to satisfy the html component
    const index = this.selectedOptions.indexOf(option);
    if (index !== -1) {
      // Remove the value if it exists
      this.selectedOptions.splice(index, 1);
    } else {
      // Add the value if it doesn't exist
      this.selectedOptions.push(option);
    }

    this.filterShotsData();
  }

  isSelected(option: string) {
    return this.selectedOptions.includes(option);
  }

  toggleCirclePlots(value: string) {
    this.isCirclePlotsSubject.next(value === 'true');
  }

  toggleGoals(value: string) {
    this.isGoalsSubject.next(value === 'true');
  }

  filterShotsData() {
    this.isGoals$
      .pipe(
        map((isGoals) => {
          var filteredShots = this.shotsData.filter((shot) => {
            const strength = strengthSwitch(shot.strength);
            const isShotIncluded = isGoals ? shot.outcome === 'Goal' : true;
            return this.selectedOptions.includes(strength) && isShotIncluded;
          });
          this.filteredShotsSubject.next(filteredShots);
        })
      )
      .subscribe();
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

  updateVisualization(filteredShots: GoalModel[], isCirclePlots: boolean) {
    // hide the layer that is not being used
    this.circlesLayer.style('display', isCirclePlots ? 'block' : 'none');
    this.hexbinLayer.style('display', !isCirclePlots ? 'block' : 'none');

    if (isCirclePlots) {
      // could be shot or goal plots
      this.plotCircles(filteredShots);
      return;
    }
    // !isCirclePlots, then we plot heat maps
    this.plotHexagons(filteredShots);
  }

  plotHexagons(filteredShots: GoalModel[]) {
    hexbin().size([300, 400]);

    const hexbinGenerator = hexbin().radius(20);

    // this is not an error, y and x should be transposed based on vertical rink alignment
    var hexbinsGenerated = hexbinGenerator(
      filteredShots.map((d: GoalModel) => {
        const scaledCoords = this.scaleRink(d.x, d.y);
        return [scaledCoords.y, scaledCoords.x];
      })
    );

    var color = d3
      .scaleSequential()
      .domain([0, 3])
      .interpolator(d3.interpolateRgb('transparent', '#007bff'));

    const hexagons = this.hexbinLayer.selectAll('path').data(hexbinsGenerated);

    hexagons
      .enter()
      .append('path')
      .attr('d', () => hexbinGenerator.hexagon())
      .attr('transform', (d: GoalModel) => {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .attr('fill', (d: any) => {
        var value = Math.min(d.length, 3);

        return color(value);
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);

    hexagons.exit().transition().duration(300).remove();
  }

  plotCircles(filteredShots: GoalModel[]) {
    const circles = this.circlesLayer.selectAll('circle').data(filteredShots);

    circles
      .enter()
      .append('circle')
      .attr('cx', (d: GoalModel) => this.scaleRink(d.x, d.y).y)
      .attr('cy', (d: GoalModel) => this.scaleRink(d.x, d.y).x)
      .attr('r', 0) // Start with radius 0 for transition
      .attr('fill', (d: GoalModel) =>
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

    this.circlesLayer
      .selectAll('circle')
      .on('mouseover', function (event: any, d: GoalModel) {
        const shot = d as GoalModel;
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
      .on('click', function (event: any, shot: GoalModel) {
        if (shot.link != 'No link found.') {
          window.open(shot.link, '_blank');
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
