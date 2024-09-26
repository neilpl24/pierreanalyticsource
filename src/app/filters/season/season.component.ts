import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'season-filter',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss'],
})
export class SeasonComponent implements OnInit {
  @Output() seasonChanged = new EventEmitter<string>();

  public seasonControl = new FormControl('');
  public seasons: string[];
  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.seasonControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((season) => this.seasonChanged.emit(season!));
  }

  handleSeasonChange(season: string | null, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.seasonChanged.emit(season!);
  }
}
