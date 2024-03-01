import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ScoreCardModel } from 'src/models/game.model';
import { ShotModel } from 'src/models/shot.model';
import { StandingsModel } from 'src/models/standings.model';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  public getGames(date: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('date', date);

    return this.http.get<ScoreCardModel[]>(`${this.baseUrl}/scores/${date}`, {
      params,
      headers,
    });
  }

  public getGameData(year: string, gamePk: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('year', year);
    params = params.append('gamePk', gamePk);

    return this.http.get(`${this.baseUrl}/game/${year}/${gamePk}`, {
      params,
      headers,
    });
  }

  public getShotData(gamePk: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('gamePk', gamePk);

    return this.http.get<ShotModel[]>(`${this.baseUrl}/shots/${gamePk}`, {
      params,
      headers,
    });
  }

  public getStandings() {
    return this.http.get<StandingsModel[]>(`${this.baseUrl}/standings`);
  }

  public getDateData(year: string, date: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('year', year);
    params = params.append('date', date);

    return this.http.get(`${this.baseUrl}/scores/${year}/${date}`, {
      params,
      headers,
    });
  }
}
