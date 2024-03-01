import { Component, Input } from '@angular/core';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  @Input() title: string;
  @Input() percentile: number;

  getCircleColor(): { background: string; text: string } {
    if (this.percentile === 0) {
      return { background: 'blue', text: 'white' };
    } else if (this.percentile === 100) {
      return { background: 'red', text: 'white' };
    } else if (this.percentile <= 50) {
      const blueValue = Math.round((this.percentile) * 5.1);
      const background = `rgb(${blueValue}, ${blueValue}, 255)`;
      if (this.percentile <= 10) {
        return { background, text: 'white' };
      }
      return { background, text: 'black' };
    } else {
      const redValue = Math.round(255 - (this.percentile - 50) * 5.1);
      const greyValue = Math.round(255 - (this.percentile - 50) * 5.1);
      const background = `rgb(255, ${greyValue}, ${redValue})`;
      if (this.percentile >= 90) {
        return { background, text: 'white' };
      }
      return { background, text: 'black' };
    }
  }
}
