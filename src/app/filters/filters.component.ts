import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Injectable,
  ViewChild,
} from '@angular/core';
import { SeasonService } from '../services/season.service';
import { Console } from 'console';
import { BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { LeaderboardService } from '../services/leaderboard.service';

// Eventually, we'll want to add combinations of filters, like all players who played for the Canes or Blackhawks.

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent {
  constructor(
    private seasonService: SeasonService,
    private leaderboardService: LeaderboardService
  ) {}

  openFilterMenu() {
    this.leaderboardService.openFilterSidenav();
  }

  clearFilters() {
    this.leaderboardService.clearFilters();
  }
}
