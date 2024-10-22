import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'nationality-filter',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.css']
})
export class NationalityComponent implements OnInit, OnDestroy {
  @Output() nationalityChanged = new EventEmitter<string>();

  public nationalityControl = new FormControl('');
  public nationalities: string[];
  private subscription: Subscription;
  constructor() { }

  ngOnInit(): void {
    this.nationalities = [
      "CAN",
      "USA",
      "SWE",
      "RUS",
      "FIN",
      "CZE",
      "CHE",
      "SVN",
      "DEU",
      "DNK",
      "SVK",
      "NOR",
      "LVA",
      "BLR",
      "FRA",
      "NLD",
      "AUS",
      "AUT"
    ];
    this.subscription = this.nationalityControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((nationality) => this.nationalityChanged.emit(nationality!));
  }

  handleNationalityChange(nationality: string | null, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.nationalityChanged.emit(nationality!);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
