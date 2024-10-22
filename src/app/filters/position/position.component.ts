import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'position-filter',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit, OnDestroy {
  @Output() positionChanged = new EventEmitter<string>();

  public positionControl = new FormControl('');
  public positions: string[]
  private subscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.positions = ['C', 'L', 'R', 'D', 'G']
    this.subscription = this.positionControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((position) => this.positionChanged.emit(position!));
  }

  handlePositionChange(position: string | null, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.positionChanged.emit(position!);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
