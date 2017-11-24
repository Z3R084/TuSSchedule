import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Tournament } from '../models/tournament';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TournamentService {
  private tournament = new Tournament();
  constructor(private http: HttpClient) { }

  addTournament(name: string) {
    this.tournament.name = name;
  }

  addTournamentDb(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>('http://localhost:3000/tournament', tournament, httpOptions).pipe(
      tap((tournament: Tournament) => this.log(`added tournament ${tournament}`)),
      catchError(this.handleError<Tournament>('addTournamentDb'))
    );
  }

  getTournamentDb(): Observable<Tournament> {
    return this.http.get<Tournament>('http://localhost:3000/tournament').pipe(
      tap(t => {
        this.log(`fetched tournament`);
        this.tournament = t;
      }),
      catchError(this.handleError<Tournament>('getTournament'))
    );
  }

  updateTournamentDb(tournament: Tournament): Observable<any> {
    return this.http.put(`http://localhost:3000/tournament/${tournament.oldName}`, tournament, httpOptions).pipe(
      tap(_ => this.log(`updated tournament ${tournament.name}`)),
      catchError(this.handleError<any>('updateTournament'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`MessageService: ${message}`);
  }

  getTournament(): Tournament {
    return this.tournament;
  }
}