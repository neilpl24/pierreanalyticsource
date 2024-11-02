import { Component, AfterViewInit, OnInit } from '@angular/core';
import { PlayerModel } from 'src/models/player.model';
import {
  Observable,
  mergeMap,
  catchError,
  of,
  tap,
  Subject,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { PlayersService } from '../services/players.service';
import { ActivatedRoute, Router } from '@angular/router';
declare const gtag: Function; // Declare the gtag function
import { CardModel } from 'src/models/card.model';
import * as chroma from 'chroma-js';
import { countryCodeMap } from '../utils';
import { GamescoreModel } from 'src/models/gamescore.model';
import { GamescoreAverageModel } from 'src/models/gamescore_average.model';
import { GoalModel } from 'src/models/goal.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements AfterViewInit, OnInit {
  goalsData: GoalModel[] = [];
  goalieMode: boolean;
  assistsData: GoalModel[] = [];
  gamescore$: Observable<GamescoreModel[]>;
  gamescoreAverage$: Observable<GamescoreAverageModel>;
  showRollingAverage: boolean = false;
  public player$: Observable<PlayerModel | null>;
  public card$: Observable<CardModel | null>;
  public playerID: number;
  public height: string | undefined;
  private seasonChanged = new Subject<string>();
  public seasonChanged$ = this.seasonChanged.pipe(distinctUntilChanged());
  season: string | undefined = undefined;

  nhlTeamMainColors: any = {
    'Anaheim Ducks': '#B9975B',
    'Utah Hockey Club': '#6CADE5',
    'Boston Bruins': '#FFB81C',
    'Buffalo Sabres': '#002654',
    'Calgary Flames': '#C8102E',
    'Carolina Hurricanes': '#CC0000',
    'Chicago Blackhawks': '#CF0A2C',
    'Colorado Avalanche': '#6F263D',
    'Columbus Blue Jackets': '#002654',
    'Dallas Stars': '#00843D',
    'Detroit Red Wings': '#CE1126',
    'Edmonton Oilers': '#FF4C00',
    'Florida Panthers': '#041E42',
    'Los Angeles Kings': '#A2AAAD',
    'Minnesota Wild': '#154734',
    'Montréal Canadiens': '#AF1E2D',
    'Nashville Predators': '#FFB81C',
    'New Jersey Devils': '#CE1126',
    'New York Islanders': '#00539B',
    'New York Rangers': '#0033A0',
    'Ottawa Senators': '#E31837',
    'Philadelphia Flyers': '#F74902',
    'Pittsburgh Penguins': '#FCB514',
    'San Jose Sharks': '#006D75',
    'Seattle Kraken': '#001F5E',
    'St. Louis Blues': '#002F87',
    'Tampa Bay Lightning': '#00205B',
    'Toronto Maple Leafs': '#00205B',
    'Vancouver Canucks': '#00205B',
    'Vegas Golden Knights': '#B4975A',
    'Washington Capitals': '#041E42',
    'Winnipeg Jets': '#041E42',
  };

  navColor: string;
  seasons$: Observable<number[]>;

  seasonMap: any = {
    undefined: '20242025',
    '': '20242025',
    '2025': '20242025',
    '2024': '20232024',
    '2023': '20222023',
    '2022': '20212022',
    '2021': '20202021',
    '2020': '20192020',
    '2019': '20182019',
    '2018': '20172018',
    '2017': '20162017',
  };

  nhlTeamMap: any = {
    'Anaheim Ducks': 'ANA',
    'Utah Hockey Club': 'UTA',
    'Boston Bruins': 'BOS',
    'Buffalo Sabres': 'BUF',
    'Calgary Flames': 'CGY',
    'Carolina Hurricanes': 'CAR',
    'Chicago Blackhawks': 'CHI',
    'Colorado Avalanche': 'COL',
    'Columbus Blue Jackets': 'CBJ',
    'Dallas Stars': 'DAL',
    'Detroit Red Wings': 'DET',
    'Edmonton Oilers': 'EDM',
    'Florida Panthers': 'FLA',
    'Los Angeles Kings': 'LAK',
    'Minnesota Wild': 'MIN',
    'Montreal Canadiens': 'MTL',
    'Montréal Canadiens': 'MTL',
    'Nashville Predators': 'NSH',
    'New Jersey Devils': 'NJD',
    'New York Islanders': 'NYI',
    'New York Rangers': 'NYR',
    'Ottawa Senators': 'OTT',
    'Philadelphia Flyers': 'PHI',
    'Pittsburgh Penguins': 'PIT',
    'Seattle Kraken': 'SEA',
    'San Jose Sharks': 'SJS',
    'St. Louis Blues': 'STL',
    'Tampa Bay Lightning': 'TBL',
    'Toronto Maple Leafs': 'TOR',
    'Vancouver Canucks': 'VAN',
    'Vegas Golden Knights': 'VGK',
    'Washington Capitals': 'WSH',
    'Winnipeg Jets': 'WPG',
  };

  timelines = [
    'xGF (EV)',
    'xGA (EV)',
    'Goals (EV)',
    'xGA (SH)',
    'Primary Assists (PP)',
    'PP Contributions',
    'Primary Assists (EV)',
    'TOI (EV)',
    'Finishing',
    'TOI (SH)',
    'TOI (PP)',
  ];

  goalie_timelines = [
    'TOI',
    'Low Danger',
    'Med Danger',
    'High Danger',
    'EV',
    'Starts',
    'Shootout',
    'Med Danger Freq',
    'High Danger Freq',
    'PK',
  ];
  countryCodeMap: any;

  constructor(
    private route: ActivatedRoute,
    private playersSvc: PlayersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    gtag('config', 'G-9DLYWS6ZQV', {
      page_path: window.location.pathname,
    });

    this.countryCodeMap = countryCodeMap;
  }

  ngAfterViewInit(): void {
    this.player$ = this.route.params.pipe(
      switchMap((params) => {
        this.playerID = params['playerID'];
        this.season = params['season'];
        this.seasons$ = this.playersSvc.getYearsPlayed(this.playerID);
        this.playersSvc
          .getGoals(this.playerID, this.playerID, this.season)
          .subscribe((goals) => {
            this.goalsData = goals.filter(
              (x) => x.shooterId == this.playerID || x.goalieId == this.playerID
            );
            this.assistsData = goals.filter(
              (x) => x.assisterId == this.playerID
            );
          });
        return this.playersSvc.getInfo(this.playerID, this.season).pipe(
          mergeMap(() => this.playersSvc.getInfo(this.playerID, this.season)),
          catchError(() => {
            this.router.navigate(['/404']);
            return of(null);
          })
        );
      }),
      tap((player) => {
        if (player) {
          if (player.position != 'G') {
            this.gamescore$ = this.playersSvc.getGamescore(
              this.playerID,
              this.season
            );
            this.gamescoreAverage$ = this.playersSvc.getGamescoreAverage(
              this.playerID,
              this.season
            );
            this.goalieMode = false;
          } else {
            this.goalieMode = true;
          }
          this.navColor = this.nhlTeamMainColors[player.team];
          this.playerID = player.playerID;
          this.height = this.convertHeight(player.height); // nhl api change now returns height in inches
        }
      })
    );

    this.card$ = this.route.params.pipe(
      switchMap((params) => {
        const playerID = params['playerID'];
        const year = params['season'];
        return this.playersSvc.getInfo(playerID, year).pipe(
          mergeMap(() => this.playersSvc.getCard(playerID, year)),
          catchError(() => {
            this.router.navigate(['/404']);
            return of(null);
          })
        );
      })
    );
  }

  getLeftTimelines(position: string): string[] {
    if (position === 'G') {
      return this.goalie_timelines.slice(0, 5);
    } else {
      return this.timelines.slice(0, 6);
    }
  }

  getRightTimelines(position: string): string[] {
    if (position === 'G') {
      return this.goalie_timelines.slice(5);
    } else {
      return this.timelines.slice(6);
    }
  }

  getTimelines(position: string): string[] {
    if (position === 'G') {
      return this.goalie_timelines;
    } else {
      return this.timelines;
    }
  }

  getPercentiles(card: CardModel, player: PlayerModel): number[] {
    if (player.position == 'G') {
      return this.getGoaliePercentiles(card);
    }
    return this.getSkaterPercentiles(card);
  }

  convertHeight(height: string): string {
    // NHL API changed heights from feet and inches to inches
    // 75.0 -> 6' 3"

    if (height.includes("'")) {
      return height; // pre-api change, return the height as is
    }

    // convert the height (from inches -> feet and inches)
    let inches = parseFloat(height);
    if (isNaN(inches)) {
      return height; // if the height is not a number, just return whatever it was before we tried to convert it
    }

    // convert to feet and inches
    let feet = Math.floor(inches / 12);
    let remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
  }

  getSkaterPercentiles(card: CardModel): number[] {
    return [
      Math.round(card.xGF * 100),
      Math.round(card.xGA * 100),
      Math.round(card.goals * 100),
      Math.round(card.sh_xGA * 100),
      Math.round(card.primaryAssistsPP * 100),
      Math.round(card.pp * 100),
      Math.round(card.primaryAssistsEV * 100),
      Math.round(card.TOI * 100),
      Math.round(card.gsae * 100),
      Math.round(card.shortHandedTOI * 100),
      Math.round(card.powerPlayTOI * 100),
    ];
  }

  getGoaliePercentiles(card: CardModel): number[] {
    return [
      Math.round(card.TOI * 100),
      Math.round(card.low_danger * 100),
      Math.round(card.med_danger * 100),
      Math.round(card.high_danger * 100),
      Math.round(card.ev * 100),
      Math.round(card.starts * 100),
      Math.round(card.shootout * 100),
      Math.round(card.med_danger_freq * 100),
      Math.round(card.high_danger_freq * 100),
      Math.round(card.pk * 100),
    ];
  }

  getPercentileColor(percentile: number): {
    background: string;
    color: string;
  } {
    percentile = percentile * 100;
    const gradient = chroma
      .scale(['#c70039', '#ff5722', '#ffffff', '#7ecef9', '#007bff'])
      .mode('lab')
      .padding(0.1)
      .colors(100);

    const textColor = 'black';

    const val = Math.floor(percentile);

    return { background: gradient[val], color: textColor };
  }

  onRollingAverageToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.showRollingAverage = checkbox.checked;
  }

  getBirthdayData(birthday: string): string {
    // in age.month format, so a player who has a bday next month is 18.11
    const date = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - date.getFullYear();
    let months = today.getMonth() - date.getMonth();

    // Check if birthday has passed this year
    if (
      today.getMonth() < date.getMonth() ||
      (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
    ) {
      age--;
    }

    if (months < 0 || (months === 0 && today.getDate() < date.getDate())) {
      months += 12; // Adjust for birthdays not passed in current month
    }

    return `${date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} (${age}.${months})`;
  }

  getPlayerPosition(position: string): string {
    switch (position) {
      case 'G':
        return 'Goalie';
      case 'D':
        return 'Defenseman';
      case 'C':
        return 'Center';
      case 'L':
        return 'Left Wing';
      case 'R':
        return 'Right Wing';
      default:
        return position;
    }
  }

  getPlayerHandedness(hand: string): string {
    switch (hand) {
      case 'L':
        return 'Left';
      case 'R':
        return 'Right';
      default:
        return 'Unknown';
    }
  }

  getPlayerNationality(nationality: string): string {
    // these are just some of the nationalities I could think of
    switch (nationality) {
      case 'CAN':
        return 'Canada';
      case 'USA':
        return 'United States';
      case 'SWE':
        return 'Sweden';
      case 'FIN':
        return 'Finland';
      case 'RUS':
        return 'Russia';
      case 'CZE':
        return 'Czech Republic';
      case 'SVK':
        return 'Slovakia';
      case 'CHE':
        return 'Switzerland';
      case 'GER':
        return 'Germany';
      case 'DNK':
        return 'Denmark';
      case 'AUT':
        return 'Austria';
      case 'NOR':
        return 'Norway';
      case 'FRA':
        return 'France';
      case 'LVA':
        return 'Latvia';
      case 'BLR':
        return 'Belarus';
      case 'AUS':
        return 'Australia';
      default:
        return nationality;
    }
  }
}
