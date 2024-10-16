import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'player-comparison-tool',
  templateUrl: './player-comparison-tool.component.html',
  styleUrls: ['./player-comparison-tool.component.scss'],
})
export class PlayerComparisonToolComponent implements OnInit {
  @Input() playerAId: number;
  @Input() playerBId: number;
  @Input() goalieMode: boolean;

  skaterMetrics = [''];

  ngOnInit() {}
}
