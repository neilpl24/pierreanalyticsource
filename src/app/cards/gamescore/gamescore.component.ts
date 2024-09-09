import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-gamescore',
  templateUrl: './gamescore.component.html',
  styleUrls: ['./gamescore.component.scss'],
})
export class GamescoreComponent implements OnInit {
  x: number;
  y: number;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  ngOnInit(): void {}
}
