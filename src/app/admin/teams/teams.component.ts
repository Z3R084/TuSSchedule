import { Component } from '@angular/core';

import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';
import { Team } from '../../models/team';

@Component({
  selector: 'tus-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService) {
    this.tournament = tournamentService.getTournament();
    if (!this.tournament.teams) {
      this.tournament.teams = [new Team()];
    }
  }

  addTeam() {
    this.tournament.teams.push(new Team());
  }
}