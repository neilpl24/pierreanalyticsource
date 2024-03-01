import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'search-filter',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Output() searchChanged = new EventEmitter<string>();

  public searchControl = new FormControl('');
  private subscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((searchText) => this.searchChanged.emit(searchText!));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
