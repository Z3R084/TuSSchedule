import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Team } from './team';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MemoryService {
  constructor(private http: HttpClient) { }

  addJson(team: Team): Observable<Team> {
    console.log('addJson');
    return this.http.post<Team>('http://localhost:3000', team, httpOptions).pipe(
      tap((team: Team) => this.log(`added team w/ id=${team.id}`)),
      catchError(this.handleError<Team>('addJson'))
    );
    // this.http.post('http://localhost:3000', team, httpOptions).subscribe();
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
}