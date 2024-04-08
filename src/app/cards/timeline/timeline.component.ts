import { Component, Input } from '@angular/core';
import * as chroma from 'chroma-js';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent {
  @Input() title: string;
  @Input() percentile: number;

  getBkgColor(): { background: string; color: string } {
    const gradient = chroma
      .scale(['#c70039', '#ff5722', '#ffffff', '#7ecef9', '#007bff'])
      .mode('lab')
      .padding(0.1)
      .colors(100);

    var textColor = 'black';

    const val = Math.round(this.percentile);

    return { background: gradient[val - 1], color: textColor };
  }
}
