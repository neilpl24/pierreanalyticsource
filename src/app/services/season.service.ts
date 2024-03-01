import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private selectedSeasonSubject = new BehaviorSubject<string>('');

  selectedSeason$ = this.selectedSeasonSubject.asObservable();

  updateSelectedSeason(season: string) {
    this.selectedSeasonSubject.next(season);
  }
}
