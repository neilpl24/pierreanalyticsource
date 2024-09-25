import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerModel } from 'src/models/player.model';
import { Sort } from '@angular/material/sort';
import { Filters } from '../filters/filters.component';
import { environment } from 'src/environments/environment';
import { CardModel } from 'src/models/card.model';
import { GamescoreModel } from 'src/models/gamescore.model';
import { GamescoreAverageModel } from 'src/models/gamescore_average.model';

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

  public getGamescore(
    playerId: number,
    season?: string
  ): Observable<GamescoreModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();

    if (playerId) {
      params = params.append('id', playerId.toString());
    }
    if (season && season != '') {
      params = params.append('season', season?.toString());
    } else {
      params = params.append('season', '2024');
    }

    return this.http.get<GamescoreModel[]>(
      `${this.baseUrl}/players/gamescore/${playerId}`,
      { params, headers }
    );
  }

  public getGamescoreAverage(
    playerId: number,
    season?: string
  ): Observable<GamescoreAverageModel> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();

    if (playerId) {
      params = params.append('id', playerId.toString());
    }
    if (season && season != '') {
      params = params.append('season', season?.toString());
    } else {
      params = params.append('season', '2024');
    }

    return this.http.get<GamescoreAverageModel>(
      `${this.baseUrl}/players/gamescore/averages/${playerId}`,
      { params, headers }
    );
  }

  public getYearsPlayed(playerId: number): Observable<number[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', playerId.toString());

    return this.http.get<number[]>(
      `${this.baseUrl}/players/seasons/${playerId}`,
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

  public getName(
    filters: Filters,
    season?: string
  ): Observable<PlayerModel[] | null> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();

    if (filters.searchText) {
      params = params.append('name', filters.searchText);
    } else {
      params = params.append('name', '');
    }

    if (filters.team) {
      params = params.append('team', filters.team.toString());
    } else {
      params = params.append('team', '');
    }

    if (filters.position) {
      params = params.append('position', filters.position.toString());
    } else {
      params = params.append('position', +'');
    }

    if (filters.nationality) {
      params = params.append('nationality', filters.nationality.toString());
    } else {
      params = params.append('nationality', '');
    }

    if (filters.season) {
      if (filters.season == '') {
        filters.season = '2024';
      }
      params = params.append('season', filters.season.toString());
    } else {
      params = params.append('season', '2024');
    }

    if (season && season != '') {
      params = params.append('season', season.toString());
    }

    params = params.append('sortField', 'LASTNAME');
    params = params.append('sortDir', 'asc');

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
    let params = new HttpParams();

    if (filters.searchText) {
      params = params.append('name', filters.searchText);
    } else {
      params = params.append('name', '');
    }

    if (filters.team) {
      params = params.append('team', filters.team.toString());
    } else {
      params = params.append('team', '');
    }

    if (filters.position) {
      params = params.append('position', filters.position.toString());
    } else {
      params = params.append('position', +'');
    }

    if (filters.nationality) {
      params = params.append('nationality', filters.nationality.toString());
    } else {
      params = params.append('nationality', '');
    }
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
    let params = new HttpParams();

    if (filters.searchText) {
      params = params.append('name', filters.searchText);
    } else {
      params = params.append('name', '');
    }

    if (filters.team) {
      params = params.append('team', filters.team.toString());
    } else {
      params = params.append('team', '');
    }

    if (filters.position) {
      params = params.append('position', filters.position.toString());
    } else {
      params = params.append('position', +'');
    }

    if (filters.nationality) {
      params = params.append('nationality', filters.nationality.toString());
    } else {
      params = params.append('nationality', '');
    }

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
    return this.http.get<PlayerModel[]>(
      `${this.baseUrl}/players_no_percentile/`,
      {
        params,
        headers,
      }
    );
  }
}
