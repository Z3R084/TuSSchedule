import { Component } from '@angular/core';

import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'tus-mode',
  templateUrl: './mode.component.html'
})
export class ModeComponent {
  tournament: Tournament;
  mode: string = null;
  leagues: Array<number> = [];

  constructor(private tournamentService: TournamentService) {
    this.tournament = tournamentService.getTournament();
  }

  setLeagueNumber(strNumber: string) {
    const count = Number(strNumber);
    this.leagues = [];
    for (let i = 0; i < count; i++) {
      this.leagues.push(i + 1);
    }
    if (this.leagues.length > 1) {
      this.setLeagueTeam();
    }
  }

  create() {
    console.log(this.tournament);
    this.tournament.teams[0].league = 2;
  }

  private setLeagueTeam() {
    const add = Math.round(this.tournament.teams.length / this.leagues.length);
    let index = 0;
    for(let i = 0; i < this.tournament.teams.length; i++) {
      if (i % add === 0 && i > 0) {
        index += 1;
      }
      this.tournament.teams[i].league = this.leagues[index];
    }
    // this.tournament.teams.forEach((team, index) => {
    //   let selTeam = Math.floor(index / (this.leagues.length - 1));
    //   selTeam = (selTeam === Infinity) ? 0 : selTeam;
    //   team.league = this.leagues[selTeam];
    // }, this);
  }
}