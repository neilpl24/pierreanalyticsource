import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Filters {
  searchText: string;
  team: string[];
  nationality: string[];
  position: string[];
  season: string | null;
}

export const filtersDefault: Filters = {
  searchText: '',
  team: [],
  nationality: [],
  position: [],
  season: null,
};

/*
A service class that manages the state of the leaderboards. This is seperation of concerns from the components that manage the UI of the leaderboards.
Components:
- Filters Sidebar (open/close state)
- Filters Values (what filters are applied)
- Available Filters (what filters are available to be applied)
*/
@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  // Filters Values (what filters are applied)
  private filtersSubject = new BehaviorSubject<Filters>(filtersDefault);
  @Output() public filters$ = this.filtersSubject.asObservable();

  // Filters Sidebar (open/close state)
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  openFilterSidenav() {
    this.isOpenSubject.next(true);
  }

  closeFilterSidenav() {
    this.isOpenSubject.next(false);
  }

  // Available Filters (what filters are available to be applied)
  private availableFiltersSubject = new BehaviorSubject<{
    positions: string[];
    nationalities: string[];
    teams: string[];
  }>({
    positions: [],
    nationalities: [],
    teams: [],
  });

  public availableFilters$ = this.availableFiltersSubject.asObservable();

  setAvailableFilters(
    positions: string[],
    nationalities: string[],
    teams: string[]
  ) {
    // set the team filter in a predicatable order
    teams = teams.sort();

    this.availableFiltersSubject.next({
      positions,
      nationalities,
      teams,
    });
  }

  updateFilters(newFilters: Partial<Filters>) {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...newFilters,
    });
  }

  clearFilters() {
    // reset the filters to the default
    this.filtersSubject.next({
      searchText: '',
      team: [],
      nationality: [],
      position: [],
      season: null,
    });
  }
}
