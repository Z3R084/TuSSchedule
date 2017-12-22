import { Component, OnInit } from '@angular/core';

import { TournamentService } from '../services/tournament.service';
import { Table } from '../models/table';

@Component({
  selector: 'tus-standings',
  templateUrl: './standings.component.html'
})
export class StandingsComponent implements OnInit {
  standings: Table[];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.getTournamentDb().subscribe((tournament) => {
      if (tournament.table) {
        this.standings = tournament.table.sort((t1, t2) => {
          // if (t2.points - t1.points === 0) {
          //   return (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
          // }
          // return t2.points - t1.points;
          return t2.points - t1.points || (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
        });
      }
    });
  }
 }