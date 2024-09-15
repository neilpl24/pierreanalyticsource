import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { ReleaseNoteModel } from 'src/models/release-note.model';
import { Observable, tap } from 'rxjs';
declare var gtag: Function; // Declare the gtag function

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnInit {
  public releaseNotes$: Observable<ReleaseNoteModel[]>;
  public imageMap: { [key: string]: string } = {
    'Bennett Summy': 'bennett-alt.jpg',
    'Neil Pierre-Louis': 'neil-alt.png',
  };

  constructor(private teamSvc: TeamsService) {}

  ngOnInit(): void {
    // what does this do?
    gtag('config', 'G-9DLYWS6ZQV', {
      page_path: window.location.pathname,
    });

    this.releaseNotes$ = this.teamSvc.getReleaseNotes().pipe(tap(console.log));
  }

  ngAfterViewInit(): void {}
}
