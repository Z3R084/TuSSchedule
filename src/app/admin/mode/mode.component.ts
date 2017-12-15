import { Component } from '@angular/core';
import * as shuffle from 'shuffle-array';

import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';
import { Team } from '../../models/team';
import { Schedule } from '../../models/schedule';

@Component({
  selector: 'tus-mode',
  templateUrl: './mode.component.html'
})
export class ModeComponent {
  tournament: Tournament;
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
    } else if (this.leagues.length === 1) {
      for (let team of this.tournament.teams) {
        team.league = 1;
      }
    }
  }

  create() {
    this.generateSchedule();
    this.tournamentService.addTournamentDb(this.tournament).subscribe();
  }

  update() {
    if (this.tournament.schedule) {
      this.tournament.schedule.length = 0;
    }
    this.generateSchedule();
    this.tournamentService.updateTournamentDb(this.tournament).subscribe();
  }

  private generateSchedule(): void {
    if (this.tournament.mode === 'league') {
      this.generateRoundRobinTournamentSchedule();
    } else {
      this.generateKoTournamentSchedule();
    }
  }

  private generateRoundRobinTournamentSchedule(teams?: any, cancel?: boolean) {
    // let schedule: Schedule[] = [];
    if (!this.tournament.schedule) {
      this.tournament.schedule = [];
    }
  
    teams = teams || this.tournament.teams.filter((team, index) => {
      return team.league === 1;
    });


    if (teams.length % 2 === 1) {
      const dummy: Team = { name: 'Spielfrei', league: 1 };
      teams.push(dummy);
    }

    const rounds = teams.length - 1;
    
    for (let i = 0; i < rounds; i++) {
      //schedule[i] = [];
      for (let j = 0; j < teams.length / 2; j++) {
        // schedule[i].push([teams[j].name, teams[rounds - j].name]);
        this.tournament.schedule.push(new Schedule(teams[j].name, teams[rounds - j].name));
      }
      teams.splice(1, 0, teams.pop());
    }
    
    if (this.tournament.secondRound === true && (!cancel)) {
      teams = shuffle(teams);
      this.generateRoundRobinTournamentSchedule(teams, true);
    }
  }

  private generateKoTournamentSchedule() {
    let schedule = [];
    const teams = this.tournament.teams;

    if (teams.length % 2 === 1) {
      const dummy: Team = { name: 'Freilos', league: 1 };
      teams.push(dummy);
    }
    
    while(teams.length > 1) {
      let randomNumber = Math.floor(Math.random() * teams.length)
      const team1 = teams[randomNumber];
      teams.splice(randomNumber, 1);
      randomNumber = Math.floor(Math.random() * teams.length)
      const team2 = teams[randomNumber];
      schedule.push([team1.name, team2.name]);
      teams.splice(randomNumber, 1);
    }
    console.log(schedule);
    
  }

  private setLeagueTeam() {
    const add = Math.round(this.tournament.teams.length / this.leagues.length);
    let index = 0;
    for (let i = 0; i < this.tournament.teams.length; i++) {
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