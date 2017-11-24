import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from '../services/tournament.service';
import { Tournament } from '../models/tournament';

@Component({
  selector: 'tus-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService, private route: Router) {
    this.tournament = tournamentService.getTournament();
   }

  ngOnInit() {
    this.tournamentService.getTournamentDb().subscribe(tournament => {
      this.tournament = tournament
      this.tournament.oldName = tournament.name;
    });
  }

  add() {
    // this.tournamentService.addTournament(name);
    this.route.navigate(['/admin/teams']);
  }
 }