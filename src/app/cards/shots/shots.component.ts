import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ShotModel } from 'src/models/shot.model';
import { Router } from '@angular/router';

@Component({
  selector: 'shots',
  templateUrl: './shots.component.html',
  styleUrls: ['./shots.component.css'],
})
export class ShotsComponent implements AfterViewInit, OnChanges {
  @ViewChild('rinkCanvas', { static: false }) canvasRef: ElementRef;
  @Input() shotsData: ShotModel[];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.drawCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shotsData'] && !changes['shotsData'].firstChange) {
      const context: CanvasRenderingContext2D | null =
        this.canvasRef.nativeElement.getContext('2d');
      this.clearCanvas(context!);
      this.drawCanvas();
      this.drawShotMarkers(context!);
    }
  }

  clearCanvas(context: CanvasRenderingContext2D | null): void {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }

  drawCanvas(): void {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    const rinkImage = new Image();
    rinkImage.src = 'assets/rink3.png';
    rinkImage.onload = () => {
      canvas.width = 292;
      canvas.height = 292;
      context!.drawImage(rinkImage, 6, 7, 292, 292, 0, 0, 292, 292);
      this.drawShotMarkers(context!);
    };
  }

  getTooltipContent(shot: ShotModel): string {
    return `Type: ${shot.type}, xG: ${this.roundNumber(shot.xG, 2)}`;
  }

  roundNumber(number: number | undefined, decimalPlaces: number): number {
    if (number === undefined) {
      return 0;
    }

    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

  redirectToLink(link: string) {
    if (link != 'No link found.') {
      if (link.slice(-4) == 'm3u8') {
        const urlTree = this.router.createUrlTree(['/video', link]);
        const url = this.router.serializeUrl(urlTree);
        window.open(url, '_blank');
      } else {
        window.open(link, '_blank');
      }
    }
  }

  drawShotMarkers(context: CanvasRenderingContext2D) {
    if (!this.shotsData) return;

    for (const shot of this.filterShots(this.shotsData)) {
      const { x, y } = this.getShotImageCoordinates(shot.x, shot.y);
      this.drawShotMarker(context, y, x, shot.Link);
    }
  }

  drawShotMarker(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    link: string
  ) {
    const radius = 6;

    context.beginPath();
    // this is an arbitrary adjustment to make the shot markers cover the center of the circle
    context.arc(x + 10, y + 10, radius, 0, 2 * Math.PI, false);
    if (link == 'No link found.') {
      // if there's no link, making the shot marker light grey
      context.fillStyle = 'lightgrey';
    } else {
      // the shot markers are light blue if there's a link
      context.fillStyle = '#529BFD';
    }
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
  }

  getShotImageCoordinates(
    nhlX: number,
    nhlY: number
  ): { x: number; y: number } {
    // 0, 0 at center ice
    // y runs from -42.5 to 42.5 (top to bottom)
    // x runs from -100 to 100 (left to right)

    // sometimes the nhl shot markers are placed on the wrong side of the ice
    // but there's nothing we can do about that

    var imageX: number;
    var imageY: number;

    // the image is 292x292, so my calculations are based on that
    // updating the image size will require updating these calculations

    // images are plotted from the top and left, so a different coord system needs to be factored in

    if (nhlX < 0) {
      // if the nhlX is negative, we need to translate it
      imageX = 292 - Math.abs(nhlX) * 2.92;
      imageY = 146 + nhlY * 2.92;
    } else {
      imageX = 292 - nhlX * 2.92;
      imageY = 146 - nhlY * 2.92;
    }
    return { x: imageX, y: imageY };
  }

  filterShots(shots: ShotModel[]): ShotModel[] {
    return shots.filter((shot) => shot.Outcome == 'goal');
  }
}
