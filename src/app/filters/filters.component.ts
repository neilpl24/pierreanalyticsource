import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SeasonService } from '../services/season.service';

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
  season: '',
};

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent {
  @Output() filtersUpdated = new EventEmitter<Filters>();

  private filters: Filters = filtersDefault;

  constructor(private seasonService: SeasonService) {}

  handleSearchChange(searchText: string) {
    this.filters = {
      ...this.filters,
      searchText,
    };
    this.emit();
  }

  handleTeamChange(team: string) {
    this.filters = {
      ...this.filters,
      team,
    };
    this.emit();
  }

  handleSeasonChange(season: string) {
    this.filters = {
      ...this.filters,
      season,
    };
    this.seasonService.updateSelectedSeason(season);
    this.emit();
  }

  handleNationalityChange(nationality: string) {
    this.filters = {
      ...this.filters,
      nationality,
    };
    this.emit();
  }

  handlePositionChange(position: string) {
    this.filters = {
      ...this.filters,
      position,
    };
    this.emit();
  }

  emit() {
    this.filtersUpdated.emit(this.filters);
  }
}
