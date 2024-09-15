import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as chroma from 'chroma-js';
import * as d3 from 'd3';
import { GamescoreModel } from 'src/models/gamescore.model';
import { GamescoreAverageModel } from 'src/models/gamescore_average.model';

@Component({
  selector: 'gamescore',
  templateUrl: './gamescore.component.html',
  styleUrls: ['./gamescore.component.scss'],
})
export class GamescoreComponent implements OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  @Input() data: GamescoreModel[];
  @Input() average: GamescoreAverageModel;
  @Input() showRollingAverage: boolean;
  tData: [Date, number][];
  rollingData: [Date, number][];
  x: any;
  y: any;
  width = 200;
  height = 500 / 4;
  marginTop = 10;
  marginBottom = 10;
  svg: d3.Selection<SVGSVGElement, unknown, null, any>;
  tooltip: any;
  line: any;
  rollingLine: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['showRollingAverage']) {
      this.tData = this.data.map((d) => [new Date(d.date), d.gamescore]);
      this.rollingData = this.calculateRollingAverage(this.tData);
      this.deleteChart();
      if (this.tData.length > 0) {
        this.drawChart();
      }
    }
  }

  calculateRollingAverage(data: [Date, number][]): [Date, number][] {
    const rollingAvg: [Date, number][] = [];
    for (let i = 4; i < data.length; i++) {
      const window = data.slice(i - 4, i + 1);
      const average = window.reduce((sum, [, score]) => sum + score, 0) / 5;
      rollingAvg.push([data[i][0], average]);
    }
    return rollingAvg;
  }

  getPercentileColor(percentile: number): {
    background: string;
    color: string;
  } {
    percentile = percentile * 100;
    const gradient = chroma
      .scale(['#c70039', '#ff5722', '#ffffff', '#7ecef9', '#007bff'])
      .mode('lab')
      .padding(0.1)
      .colors(100);

    var textColor = 'black';
    const val = Math.floor(percentile);

    return { background: gradient[val], color: textColor };
  }

  generateTooltip(selectedData: GamescoreModel) {
    const tooltipProps: { label: string; value: keyof GamescoreModel }[] = [
      { label: 'Date', value: 'date' },
      { label: 'Gamescore', value: 'gamescore' },
    ];

    let str = '';
    tooltipProps.forEach((x) => {
      let data = selectedData[x.value];
      if (typeof data == 'number') {
        data = Math.round(data * 100) / 100;
      }
      str += `<div>${x.label}: ${data}</div>`;
    });

    d3.select('#tt').remove();
    this.tooltip = d3
      .select(this.chartContainer.nativeElement)
      .append('div')
      .attr('id', 'tt')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .html(str);
  }

  deleteChart() {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();
  }

  initSvg() {
    const isMobile = window.innerWidth <= 768;
    const width = isMobile ? '80%' : '40%'; // Set 80% for mobile, 40% for others

    this.svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .style('border-radius', '8px')
      .style('-webkit-tap-highlight-color', 'transparent')
      .style('overflow', 'visible')
      .attr('width', width)
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');
  }

  drawChart() {
    this.x = d3
      .scaleUtc()
      .domain(d3.extent(this.tData, (d) => d[0]) as [Date, Date])
      .range([0, this.width]);
    this.y = d3.scaleLinear(
      [-3, 6],
      [this.height - this.marginBottom, this.marginTop]
    );

    this.initSvg();

    this.tooltip = this.svg
      .append('g')
      .style('position', 'absolute')
      .style('visbility', 'hidden')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height - this.marginBottom})`)
      .call(
        d3
          .axisBottom<Date>(this.x)
          .tickSizeOuter(0)
          .ticks(d3.timeMonth.every(1))
          .tickFormat(d3.timeFormat('%m/%d'))
          .tickPadding(10)
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '8px')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '-0.5em');

    this.svg
      .append('g')
      .call(d3.axisLeft(this.y).ticks(this.height / 40))
      .call((g) => g.select('domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', this.width)
          .attr('stroke-opacity', 0.1)
      );

    this.line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d) => this.x(d[0]))
      .y((d) => this.y(d[1]));

    this.svg
      .append('path')
      .datum(this.tData)
      .attr('fill', 'none')
      .attr('stroke', '#a82a23')
      .attr('stroke-width', 1)
      .attr('d', this.line);

    this.svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', this.y(0))
      .attr('x2', this.width)
      .attr('y2', this.y(0))
      .attr('stroke', 'blue')
      .attr('stroke-dasharray', '4')
      .attr('stroke-width', 1);

    this.svg
      .selectAll('.dot')
      .data(this.tData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 1.25)
      .attr('cx', (d) => this.x(d[0]))
      .attr('cy', (d) => this.y(d[1]))
      .on('mouseover', (event, d) => this.mousemoved(event, d))
      .on('mouseout', this.mouseleft);

    this.tooltip
      .selectAll('path')
      .attr('y1', this.y(0))
      .attr('x2', this.width)
      .attr('y2', this.y(0))
      .attr('stroke', 'red')
      .attr('stroke-dasharray', '4');

    if (this.showRollingAverage) {
      this.rollingLine = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((d) => this.x(d[0]))
        .y((d) => this.y(d[1]));

      this.svg
        .append('path')
        .datum(this.rollingData)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('d', this.rollingLine);
    }
  }

  mouseleft = () => {
    this.tooltip?.style('visibility', 'hidden');
  };

  mousemoved = (event: MouseEvent, d: [Date, number]) => {
    const [date, score] = d;
    const xPos = event.pageX;
    const yPos = event.pageY / 4 - 100;
    const offset = 10;
    this.generateTooltip({
      date: date.toISOString().split('T')[0],
      gamescore: score,
    } as GamescoreModel);

    this.tooltip
      .style('visibility', 'visible')
      .style('top', `${yPos}px`)
      .style('left', `${xPos + offset}px`);
  };
}
