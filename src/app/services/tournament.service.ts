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
import { stagger } from '@angular/animations/src/animation_metadata';

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

  updateSchedule(schedule?: Schedule[], originalSchedule?: Schedule[]): Observable<any> {
    if (schedule && originalSchedule) {
      this.updateStandings(schedule, originalSchedule);
      if (this._tournament.tournamentSchedule) {
        this.fillFinals();
      }
    }

    return this.http.put(`http://localhost:3000/schedule/${this._tournament.name}`, this._tournament, httpOptions).pipe(
      catchError(this.handleError<any>('updateSchedule'))
    );
  }

  private fillFinals(): void {
    let index = 0;
    const standingsLeague1 = this._tournament.table.filter(teamStanding => teamStanding.league === 1).sort((t1, t2) => {
      return t2.points - t1.points || (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
    });
    let standingsLeague2 = this._tournament.table.filter(teamStanding => teamStanding.league === 2).sort((t1, t2) => {
      return t2.points - t1.points || (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
    });
    if (standingsLeague2.length === 0) {
      standingsLeague2 = standingsLeague1.map(x => Object.assign({}, x));
      standingsLeague2.shift();
      index = 2;
    } else {
      index = 1;
    }

    const numberTeamsToForward = this._tournament.tournamentSchedule[0].schedule.length;
    index = (numberTeamsToForward === 1) ? 0 : index;
    for (let i = 0; i < numberTeamsToForward; i++) {
      this._tournament.tournamentSchedule[0].schedule[i].team1 = standingsLeague1[i].team;
      this._tournament.tournamentSchedule[0].schedule[i].team2 = standingsLeague2[index - i].team;
    }
  }

  private calcTable(): void {
    this._tournament.table.forEach((entry, index) => {
      entry.drawn = 0;
      entry.goalsAgainst = 0;
      entry.goalsFor = 0;
      entry.won = 0;
      entry.lost = 0;
      entry.points = 0;

      const t = this._tournament.schedule.filter(game => game.team1 === entry.team);
      t.forEach((game, index) => {
        if (game.goals1 !== null && game.goals2 !== null) {
          this.converToInt(game);
          if (game.goals1 > game.goals2) {
            entry.won++;
            entry.points += 3;
          } else if (game.goals1 === game.goals2) {
            entry.drawn++;
            entry.points += 1;
          } else {
            entry.lost++;
          }

          entry.goalsFor += game.goals1;
          entry.goalsAgainst += game.goals2;
        }
      });

      const t1 = this._tournament.schedule.filter(game => game.team2 === entry.team);
      t1.forEach((game, index) => {
        if (game.goals1 !== null && game.goals2 !== null) {
          this.converToInt(game);
          if (game.goals2 > game.goals1) {
            entry.won++;
            entry.points += 3;
          } else if(game.goals2 === game.goals1) {
            entry.drawn++;
            entry.points += 1;
          } else {
            entry.lost++;
          }

          entry.goalsFor += game.goals2;
          entry.goalsAgainst += game.goals1;
        }
      });
    });
  }

  private updateStandings(schedule: Schedule[], originalSchedule: Schedule[]): void {
    this.calcTable();
    // schedule.forEach((game, index) => {
    //   let standingEntry1 = this._tournament.table.find(team => team.team === game.team1);
    //   let standingEntry2 = this._tournament.table.find(team => team.team === game.team2);
    //   this.converToInt(game);
    //   if (game.goals1 && game.goals2 && !game.saved) {
    //     game.saved = true;
    //     this.updateStanding(game, standingEntry1, standingEntry2);
    //   } else if (game.goals1 && game.goals2 && game.saved) {
    //     this.updateEntry(game, originalSchedule[index], standingEntry1, standingEntry2);
    //   }
    // });
  }

  private converToInt(game: Schedule): void {
    game.goals1 = parseInt(<any>game.goals1);
    game.goals2 = parseInt(<any>game.goals2);
  }

  /// ToDo: Migration mit updateStanding möglich?
  /// ToDo: Muss eigentlich in schedule.component.ts ausgeführt werden
  private updateEntry(game: Schedule, gameOriginal: Schedule, standingTeam1: Table, standingTeam2: Table): void {
    if (game.goals1 == gameOriginal.goals1 && game.goals2 == gameOriginal.goals2) {
      return;
    }
    standingTeam1.goalsFor += (game.goals1 - gameOriginal.goals1);
    standingTeam1.goalsAgainst += (game.goals2 - gameOriginal.goals2);
    standingTeam2.goalsFor += (game.goals2 - gameOriginal.goals2);
    standingTeam2.goalsAgainst += (game.goals1 - gameOriginal.goals1);

    if (game.goals1 < game.goals2 && gameOriginal.goals1 > gameOriginal.goals2) {
      this.addLose(standingTeam1, true);
      this.addVictory(standingTeam2, true);
    } else if (game.goals1 > game.goals2 && gameOriginal.goals1 < gameOriginal.goals2) {
      this.addVictory(standingTeam1, true);
      this.addLose(standingTeam2, true);
    } else if (game.goals1 === game.goals2 && gameOriginal.goals1 > gameOriginal.goals2) {
      standingTeam1.won -= 1;
      standingTeam1.points -= 3;
      standingTeam2.lost -= 1;
      this.addDraw(standingTeam1);
      this.addDraw(standingTeam2);
    } else if (game.goals1 === game.goals2 && gameOriginal.goals1 < gameOriginal.goals2) {
      standingTeam1.lost -= 1;
      standingTeam2.won -= 1;
      standingTeam2.points -= 3;
      this.addDraw(standingTeam1);
      this.addDraw(standingTeam2);
    } else if (game.goals1 > game.goals2 && gameOriginal.goals1 === gameOriginal.goals2) {
      this.subDraw(standingTeam1);
      this.subDraw(standingTeam2);
      this.addVictory(standingTeam1);
      this.addLose(standingTeam2);
    } else if (game.goals1 < game.goals2 && gameOriginal.goals1 === gameOriginal.goals2) {
      this.subDraw(standingTeam1);
      this.subDraw(standingTeam2);
      this.addLose(standingTeam1);
      this.addVictory(standingTeam2);
    }
  }

  private addVictory(standing: Table, changed?: boolean) {
    standing.won += 1;
    standing.points += 3;
    if (changed) {
      standing.lost -= 1;
    }
  }

  private addLose(standing: Table, changed?: boolean) {
    standing.lost += 1;
    if (changed) {
      standing.won -= 1;
      standing.points -= 3;
    }
  }

  private addDraw(standing: Table) {
    standing.drawn += 1;
    standing.points += 1;
  }

  private subDraw(standing: Table) {
    standing.drawn -= 1;
    standing.points -= 1;
  }

  private updateStanding(game: Schedule, standingTeam1: Table, standingTeam2: Table) {
    if (game.goals1 > game.goals2) {
      this.addVictory(standingTeam1);
      this.addLose(standingTeam2);
    } else if (game.goals1 === game.goals2) {
      this.addDraw(standingTeam1);
      this.addDraw(standingTeam2);
    } else {
      this.addLose(standingTeam1);
      this.addVictory(standingTeam2);
    }
    standingTeam1.goalsFor += game.goals1;
    standingTeam1.goalsAgainst += game.goals2;
    standingTeam2.goalsFor += game.goals2;
    standingTeam2.goalsAgainst += game.goals1;
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