import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TeamModel } from 'src/models/team.model';
import { StandingsModel } from 'src/models/standings.model';
import { RosterModel } from 'src/models/roster.model';
import { TeamCardModel } from 'src/models/team-card.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;
  public team$: Observable<TeamModel | null>;
  public standings$: Observable<StandingsModel | null>;
  public roster$: Observable<RosterModel | null>;
  public teamCard$: Observable<TeamCardModel | null>;

  public getTeam(teamId: number): Observable<TeamModel | null> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', teamId.toString());

    return this.http.get<TeamModel>(`${this.baseUrl}/teams/${teamId}`, {
      params,
      headers,
    });
  }

  public getStandings(teamId: number): Observable<StandingsModel> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('teamId', teamId.toString());

    return this.http.get<any>(`${this.baseUrl}/teams/standings/${teamId}`, {
      params,
      headers,
    });
  }

  public getRoster(teamId: string): Observable<RosterModel[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('teamId', teamId.toString());

    return this.http.get<RosterModel[]>(
      `${this.baseUrl}/teams/roster/${teamId}`,
      { params, headers }
    );
  }

  public getTeamCard(teamId: string): Observable<TeamCardModel> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('teamId', teamId.toString());

    return this.http.get<TeamCardModel>(
      `${this.baseUrl}/teams/card/${teamId}`,
      { params, headers }
    );
  }
}
