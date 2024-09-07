import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerModel } from 'src/models/player.model';
import { Sort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { CardModel } from 'src/models/card.model';
import { WarModel } from 'src/models/war.model';
import { GoalieModel } from 'src/models/goalie.model';
import { TeamLeaderboardModel } from 'src/models/team-leaderboard.model';
import { Filters } from './leaderboard.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  public getCard(
    playerId: number,
    season?: string
  ): Observable<CardModel | null> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', playerId.toString());
    if (season && season != '') {
      params = params.append('season', season?.toString());
    }

    if (season == '') {
      params = params.append('season', '2024');
    }
    return this.http.get<CardModel>(
      `${this.baseUrl}/players/card/${playerId}`,
      { params, headers }
    );
  }

  public getInfo(
    playerId: number,
    season?: string
  ): Observable<PlayerModel | null> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', playerId.toString());
    if (season && season != '') {
      params = params.append('season', season?.toString());
    }

    if (season == '') {
      params = params.append('season', '2024');
    }
    return this.http.get<PlayerModel>(
      `${this.baseUrl}/players/info/${playerId}`,
      { params, headers }
    );
  }

  public getName(filters: Filters, season?: string): Observable<PlayerModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    const sortDefault: Sort = { active: 'LASTNAME', direction: 'asc' };

    let params = this.buildFilterParams(filters, sortDefault);

    return this.http.get<PlayerModel[]>(`${this.baseUrl}/players/`, {
      params,
      headers,
    });
  }

  public search(filters: Filters, sort: Sort): Observable<PlayerModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    let params = this.buildFilterParams(filters, sort);

    return this.http.get<PlayerModel[]>(`${this.baseUrl}/players/`, {
      params,
      headers,
    });
  }

  public search_no_percentile(
    filters: Filters,
    sort: Sort
  ): Observable<PlayerModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    let params = this.buildFilterParams(filters, sort);

    return this.http.get<PlayerModel[]>(
      `${this.baseUrl}/players_no_percentile/skaters`,
      {
        params,
        headers,
      }
    );
  }

  public buildFilterParams(filters: Filters, sort: Sort): HttpParams {
    let params = new HttpParams();

    if (filters.searchText) {
      params = params.append('name', filters.searchText);
    } else {
      params = params.append('name', '');
    }
    // from legacy code which did filtering on the backend
    params = params.append('team', '');

    params = params.append('position', '');

    params = params.append('nationality', '');

    if (filters.season) {
      if (filters.season == '') {
        filters.season = '2024';
      }
      params = params.append('season', filters.season.toString());
    } else {
      params = params.append('season', '2024');
    }

    if (sort.active) {
      params = params.append('sortField', sort.active);
      params = params.append('sortDir', sort.direction);
    }

    console.log(params);
    return params;
  }

  public getSkaterLeaderboard(
    filters: Filters,
    sort: Sort
  ): Observable<PlayerModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = this.buildFilterParams(filters, sort);

    return this.http.get<PlayerModel[]>(`${this.baseUrl}/leaderboard/skaters`, {
      params,
      headers,
    });
  }

  public getGoalieLeaderboard(
    filters: Filters,
    sort: Sort
  ): Observable<GoalieModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = this.buildFilterParams(filters, sort);

    return this.http.get<GoalieModel[]>(`${this.baseUrl}/leaderboard/goalies`, {
      params,
      headers,
    });
  }

  // this probably should be in teams service, but all the infrastructure is here
  public getTeamLeaderboard(
    filters: Filters,
    sort: Sort
  ): Observable<TeamLeaderboardModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    let params = this.buildFilterParams(filters, sort);

    return this.http.get<TeamLeaderboardModel[]>(
      `${this.baseUrl}/leaderboard/teams`,
      {
        params,
        headers,
      }
    );
  }
}
