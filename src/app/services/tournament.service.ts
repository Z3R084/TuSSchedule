import { Injectable } from '@angular/core';

import { Tournament } from '../models/tournament';

@Injectable()
export class TournamentService {
  private tournament = new Tournament();
  constructor() { }

  addTournament(name: string) {
    this.tournament.name = name;
  }

  getTournament(): Tournament {
    return this.tournament;
  }
}