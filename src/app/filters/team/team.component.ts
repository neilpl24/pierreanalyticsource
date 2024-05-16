import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'team-filter',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit, OnDestroy {
  @Output() teamChanged = new EventEmitter<string>();

  public teamControl = new FormControl('');
  public teams: string[];
  private subscription: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.teams = [
      'Anaheim Ducks',
      'Arizona Coyotes',
      'Boston Bruins',
      'Buffalo Sabres',
      'Calgary Flames',
      'Carolina Hurricanes',
      'Chicago Blackhawks',
      'Colorado Avalanche',
      'Columbus Blue Jackets',
      'Dallas Stars',
      'Detroit Red Wings',
      'Edmonton Oilers',
      'Florida Panthers',
      'Los Angeles Kings',
      'Minnesota Wild',
      'Montréal Canadiens',
      'Nashville Predators',
      'New Jersey Devils',
      'New York Islanders',
      'New York Rangers',
      'Ottawa Senators',
      'Philadelphia Flyers',
      'Pittsburgh Penguins',
      'San Jose Sharks',
      'Seattle Kraken',
      'St. Louis Blues',
      'Tampa Bay Lightning',
      'Toronto Maple Leafs',
      'Vancouver Canucks',
      'Vegas Golden Knights',
      'Washington Capitals',
      'Winnipeg Jets',
    ];
    this.subscription = this.teamControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((team) => this.teamChanged.emit(team!));
  }

  handleTeamChange(team: string | null, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.teamChanged.emit(team!);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
