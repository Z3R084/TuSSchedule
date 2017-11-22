import { Component } from '@angular/core';

import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'tus-mode',
  templateUrl: './mode.component.html'
})
export class ModeComponent {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService) {
    this.tournament = tournamentService.getTournament();
  }
}