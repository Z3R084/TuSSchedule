import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Tournament } from '../models/tournament';
import { Schedule } from '../models/schedule';
import { MessageService } from '../services/message.service';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, publishReplay } from 'rxjs/operators';
import { refCount } from 'rxjs/operators/refCount';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TournamentService {
  // private tournament = new Tournament();
  private tournament: Observable<Tournament>;
  private _tournament: Tournament = new Tournament();

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // addTournament(name: string) {
  //   this.tournament.name = name;
  // }

  addTournamentDb(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>('http://localhost:3000/tournament', tournament, httpOptions).pipe(
      tap((tournament: Tournament) => this.log(`added tournament ${tournament}`)),
      catchError(this.handleError<Tournament>('addTournamentDb'))
    );
  }

  getTournament(): Tournament {
    return this._tournament;
  }

  getTournamentDb(): Observable<Tournament> {
    if (!this.tournament) {
      this.tournament = this.http.get<Tournament>('http://localhost:3000/tournament').pipe(
        tap(t => {
          if (t.teams) {
            t.teams.forEach((team) => {
              team.originalName = team.name;
            });
          }
          this._tournament = t;
          return t;
        }),
        catchError(this.handleError<Tournament>('getTournament')),
        publishReplay(1),
        refCount()
      );
    }
    return this.tournament;
  }

  // getTournamentDb(): Observable<Tournament> {
  //   return this.http.get<Tournament>('http://localhost:3000/tournament').pipe(
  //     tap(t => {
  //       this.log(`fetched tournament`);
  //       this._tournament = t;
  //       return t;
  //     }),
  //     catchError(this.handleError<Tournament>('getTournament')),
  //   );
  // }

  updateTournamentDb(tournament: Tournament): Observable<any> {
    return this.http.put(`http://localhost:3000/tournament/${tournament.oldName}`, tournament, httpOptions).pipe(
      // tap(_ => this.log(`updated tournament ${tournament.name}`)),
      catchError(this.handleError<any>('updateTournament'))
    );
  }

  updateSchedule(schedule: Schedule[]): Observable<any> {
    return this.http.put(`http://localhost:3000/schedule/${this._tournament.name}`, schedule, httpOptions).pipe(
      catchError(this.handleError<any>('updateSchedule'))
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
    this.messageService.add('tournamentService: ' + message);
  }
}