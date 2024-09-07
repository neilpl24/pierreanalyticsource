import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { Filters, LeaderboardService } from '../services/leaderboard.service';
import { availableSeasons, countryCodeMap } from '../utils';
enum LeaderboardType {
  Skaters = 'skaters',
  Goalies = 'goalies',
  Teams = 'teams',
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  @Input() type: LeaderboardType = LeaderboardType.Skaters; // the default type is skater
  routeType: string;
  availableSeasons: string[];
  @ViewChild('filterSidenav') filterSidenav!: MatSidenav;

  filters$: Observable<Filters>;
  availableFilters: Observable<{
    positions: string[];
    nationalities: string[];
    teams: string[];
  }>;
  countryCodeMap: { [key: string]: string };

  constructor(
    private activatedRoute: ActivatedRoute,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const type = paramMap.get('type'); // Assuming 'type' is a parameter in your route
      if (type) {
        this.setType(type as LeaderboardType);
      }
    });

    this.countryCodeMap = countryCodeMap;
    this.availableSeasons = availableSeasons;
    this.availableFilters = this.leaderboardService.availableFilters$;
    this.filters$ = this.leaderboardService.filters$;
  }

  setType(type: LeaderboardType) {
    if (type != this.type) {
      this.type = type;
    }
  }

  ngAfterViewInit(): void {
    this.leaderboardService.isOpen$.subscribe((isOpen: boolean) => {
      if (isOpen) {
        this.filterSidenav.open();
      } else {
        this.filterSidenav.close();
      }
    });
  }

  closeSidenav() {
    this.leaderboardService.closeFilterSidenav();
    this.filterSidenav.close();
  }

  updateFilters(filterType: keyof Filters, value: any) {
    this.leaderboardService.updateFilters({ [filterType]: value });
  }
}
