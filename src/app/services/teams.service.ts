import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamModel } from 'src/models/team.model';
import { Sort } from '@angular/material/sort';
import { Filters } from '../filters/filters.component';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;
  public team$: Observable<TeamModel | null>;

  public getTeam(
    teamId: number
  ): Observable<TeamModel | null> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', teamId.toString());

    return this.http.get<TeamModel>(
      `${this.baseUrl}/teams/${teamId}`,
      { params, headers }
    );
  }

  // don't need the stuff below?
  public getName(
    filters: Filters,
    season?: string
  ): Observable<TeamModel[] | null> {
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

    return this.http.get<TeamModel[]>(`${this.baseUrl}/teams/`, {
      params,
      headers,
    });
  }

  public search(filters: Filters, sort: Sort): Observable<TeamModel[]> {
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

    return this.http.get<TeamModel[]>(`${this.baseUrl}/teams/`, {
      params,
      headers,
    });
  }


}
