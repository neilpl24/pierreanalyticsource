import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PlayersService } from '../services/players.service';
import { GoalModel } from 'src/models/goal.model';
import * as chroma from 'chroma-js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  dataSource = new MatTableDataSource<GoalModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  goals: GoalModel[];
  videoLink: SafeResourceUrl | null = null;

  constructor(
    private router: Router,
    private svc: PlayersService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.svc.getGoalData().subscribe((goals) => {
      this.goals = goals;
      this.updateDataSource();
    });
  }

  openVideo(link: string) {
    if (link !== 'No link found.') {
      this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }
  }

  closeVideo() {
    this.videoLink = null;
  }

  getBkgColor(percentile: number): { background: string; color: string } {
    percentile = percentile * 100;
    let textColor = 'black';

    if (percentile <= 10) {
      return { background: '#ffffff', color: textColor };
    }

    const gradient = chroma
      .scale(['#7ecef9', '#0000ff'])
      .mode('lab')
      .colors(10);

    const val = Math.floor(percentile / 10);

    return { background: gradient[val], color: textColor };
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

  roundValue(xG: number) {
    return Math.round(xG * 100) / 100;
  }

  // tooltip text with mappings to the column names
  tooltipMappings: { [key: string]: string } = {
    xg: 'Expected Goals',
  };

  getTooltip(key: string): string {
    return this.tooltipMappings[key] || ''; // return the tooltip text if it exists, otherwise return an empty string
  }

  private updateDataSource(): void {
    this.dataSource.data = this.goals;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
