import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from 'rxjs/operators';
import { PlayerModel } from 'src/models/player.model';
import { Subscription } from 'rxjs';
import { PlayersService } from '../services/players.service';

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
  selector: 'nav-bar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  public searchControl = new FormControl({ value: '', disabled: true });
  private subscription: Subscription;
  private filters: Filters = filtersDefault;
  year: string | null = null;

  @Input() navColor: string;
  @Output() searchChanged = new EventEmitter<string>();

  public filteredPlayers: PlayerModel[] = [];

  constructor(
    private playersService: PlayersService,
    private renderer: Renderer2
  ) {}

  get isSearchInputDisabled(): boolean {
    return this.year === null;
  }

  ngOnInit(): void {
    this.renderer.setStyle(
      document.documentElement,
      '--custom-nav-color',
      this.navColor
    );
    this.subscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(
          (searchText: string | null): searchText is string =>
            searchText !== null
        ),
        switchMap(() => this.playersService.getName(this.filters))
      )
      .subscribe((players: PlayerModel[] | null) => {
        if (players !== null) {
          this.filteredPlayers = players;
        }
      });
  }

  clearSearchInput() {
    this.searchControl.setValue('');
  }

  selectYear(event: Event) {
    const year = (event.target as HTMLInputElement).value;
    this.year = year.toString();
    this.filters.season = this.year;

    if (this.year == null || this.year == 'null') {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  onSearchInputChange() {
    this.filters.searchText = this.searchControl.value!;
  }

  dropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
