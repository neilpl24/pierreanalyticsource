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
    rinkImage.src = 'assets/rink.png';
    rinkImage.onload = () => {
      canvas.width = rinkImage.width;
      canvas.height = rinkImage.height;
      context!.drawImage(rinkImage, 0, 0);
      this.drawShotMarkers(context!);
    };
  }

  getTooltipContent(shot: ShotModel): string {
    return `Type: ${shot.type}, xG: ${shot.xG}`;
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
      this.drawShotMarker(context, x, y, shot.Link);
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
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (link == 'No link found.') {
      context.fillStyle = 'blue';
    } else {
      context.fillStyle = 'red';
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
    const imageX = (Math.abs(nhlX) * -1 + 120) * 3;
    const imageY = (nhlY * -1 + 53.5) * 3;

    return { x: imageX, y: imageY };
  }

  filterShots(shots: ShotModel[]): ShotModel[] {
    return shots.filter((shot) => shot.Outcome == 'goal');
  }
}
