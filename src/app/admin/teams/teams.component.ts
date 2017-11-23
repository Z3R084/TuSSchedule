import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';
import { Team } from '../../models/team';

@Component({
  selector: 'tus-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService, private route: Router) {
    this.tournament = tournamentService.getTournament();
    if (!this.tournament.teams) {
      this.tournament.teams = [new Team()];
    }
  }

  addTeam() {
    this.tournament.teams.push(new Team());
  }

  add() {
    this.route.navigate(['/admin/mode']);
  }
}