import { Component } from '@angular/core';

import { LeaderboardService } from '../services/leaderboard.service';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent {
  constructor(private leaderboardService: LeaderboardService) {}

  openFilterMenu() {
    this.leaderboardService.openFilterSidenav();
  }

  clearFilters() {
    this.leaderboardService.clearFilters();
  }
}
