import { Component, OnInit } from '@angular/core';

import { TournamentService } from '../services/tournament.service';
import { Schedule } from '../models/schedule';
import { Tournament } from '../models/tournament';

@Component({
  selector: 'tus-schedule-component',
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.getTournamentDb().subscribe((tournament: Tournament) => {
      if (Object.keys(tournament).length === 0) {
        tournament = null;
      }
      this.tournament = tournament;
      
    });
  }
}