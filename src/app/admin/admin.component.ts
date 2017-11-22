import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from '../services/tournament.service';
import { Team } from '../models/team';

@Component({
  selector: 'tus-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {
  constructor(private tournamentService: TournamentService, private route: Router) {}

  add(name: string) {
    this.tournamentService.addTournament(name);
    this.route.navigate(['/admin/teams']);
  }
 }