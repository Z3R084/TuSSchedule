import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Tournament } from '../models/tournament';
import { Schedule } from '../models/schedule';
import { MessageService } from '../services/message.service';
import { Table } from '../models/table';

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
      // tap((tournament: Tournament) => this.log(`added tournament ${tournament}`)),
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

  updateSchedule(schedule: Schedule[], originalSchedule: Schedule[]): Observable<any> {
    this.updateStandings(schedule, originalSchedule);
    return this.http.put(`http://localhost:3000/schedule/${this._tournament.name}`, schedule, httpOptions).pipe(
      catchError(this.handleError<any>('updateSchedule'))
    );
  }

  private updateStandings(schedule: Schedule[], originalSchedule: Schedule[]): void {
    //for (let game of schedule) {
    schedule.forEach((game, index) => {
      if (game.goals1 && game.goals2 && !game.saved) {
        game.saved = true;
        let standingEntry1 = this._tournament.table.find(team => team.team === game.team1);
        let standingEntry2 = this._tournament.table.find(team => team.team === game.team2);
        this.updateStanding(game, standingEntry1, standingEntry2);
      } else if (game.goals1 && game.goals2 && game.saved) {
        
      }
    });
  }

  private updateStanding(game: Schedule, standingTeam1: Table, standingTeam2: Table) {
    if (game.goals1 > game.goals2) {
      standingTeam1.won += 1;
      standingTeam1.points += 3;
      standingTeam2.lost += 1;
    } else if (game.goals1 === game.goals2) {
      standingTeam1.drawn += 1;
      standingTeam1.points += 1;
      standingTeam2.drawn += 1;
      standingTeam2.points += 1;
    } else {
      standingTeam1.lost += 1;
      standingTeam2.won += 1;
      standingTeam2.points += 3;
    }
    standingTeam1.goalsFor += parseInt(<any>game.goals1);
    standingTeam1.goalsAgainst += parseInt(<any>game.goals2);
    standingTeam2.goalsFor += parseInt(<any>game.goals2);
    standingTeam2.goalsAgainst += parseInt(<any>game.goals1);
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