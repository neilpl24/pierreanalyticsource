import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SeasonService } from '../services/season.service';
import { Console } from 'console';
import { BehaviorSubject } from 'rxjs';

export interface Filters {
  searchText: string;
  team: string | null;
  nationality: string | null;
  position: string | null;
  season: string | null;
}

export const filtersDefault: Filters = {
  searchText: '',
  team: null,
  nationality: null,
  position: null,
  season: null,
};

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  private filtersSubject = new BehaviorSubject<Filters>(filtersDefault);
  filters$ = this.filtersSubject.asObservable();

  private filters: Filters = filtersDefault;

  constructor(private seasonService: SeasonService) {}

  handleSearchChange(searchText: string) {
    this.filters = {
      ...this.filters,
      searchText,
    };
    this.filtersSubject.next(this.filters);
  }

  handleTeamChange(team: string) {
    this.filters = {
      ...this.filters,
      team,
    };
    this.filtersSubject.next(this.filters);
  }

  handleSeasonChange(season: string) {
    this.filters = {
      ...this.filters,
      season,
    };
    this.seasonService.updateSelectedSeason(season);
    this.filtersSubject.next(this.filters);
  }

  handleNationalityChange(nationality: string) {
    this.filters = {
      ...this.filters,
      nationality,
    };
    this.filtersSubject.next(this.filters);
  }

  handlePositionChange(position: string) {
    this.filters = {
      ...this.filters,
      position,
    };
    this.filtersSubject.next(this.filters);
  }

  ngOnInit(): void {}
}
