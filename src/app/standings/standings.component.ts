import { Component, OnInit, ViewChild } from '@angular/core';

import { TournamentService } from '../services/tournament.service';
import { Table } from '../models/table';
import { Tournament } from '../models/tournament';

@Component({
  selector: 'tus-standings',
  templateUrl: './standings.component.html'
})
export class StandingsComponent implements OnInit {
  standingsLeague1: Table[];
  standingsLeague2: Table[];
  timer: any;
  showSchedule: boolean = false;
  tournament: Tournament;
  scrollBarHeight: number;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.getTournamentDb().subscribe((tournament) => {
      if (tournament.table) {
        this.standingsLeague1 = tournament.table.filter(teamStanding => teamStanding.league === 1).sort((t1, t2) => {
          return t2.points - t1.points || (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
        });
        this.standingsLeague2 = tournament.table.filter(teamStanding => teamStanding.league === 2).sort((t1, t2) => {
          return t2.points - t1.points || (t2.goalsFor - t2.goalsAgainst) - (t1.goalsFor - t1.goalsAgainst);
        });
        if (this.standingsLeague2.length === 0) {
          this.standingsLeague2 = null;
        }
      }
      this.tournament = tournament;
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.showSchedule = !this.showSchedule;
    }, 10 * 1000);
  }

  endTimer(): void {
    clearInterval(this.timer);
    this.timer = null;
    if (this.showSchedule) {
      this.showSchedule = false;
    }
  }
 }