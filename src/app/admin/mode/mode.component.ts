import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as shuffle from 'shuffle-array';

import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';
import { Team } from '../../models/team';
import { Schedule } from '../../models/schedule';
import { Table } from '../../models/table';
import { Round } from '../../models/round';

@Component({
  selector: 'tus-mode',
  templateUrl: './mode.component.html'
})
export class ModeComponent {
  tournament: Tournament;
  leagues: Array<number> = [];
  generateNewSchedule: boolean = false;
  singleElimination: number[] = [2, 4, 8, 16, 32, 64];

  constructor(private tournamentService: TournamentService, private route: Router) {
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
    this.route.navigate(['/schedule']);
  }

  update() {
    if (this.generateNewSchedule) {
      this.generateSchedule();
    } else {
      this.updateTeams();
    }
    this.tournamentService.updateTournamentDb(this.tournament).subscribe();
    this.route.navigate(['/schedule']);
  }

  private updateTeams(): void {
    this.tournament.teams.forEach(team => {
      if (this.tournament.schedule) {
        this.tournament.schedule.filter(schedule => schedule.team1 === team.originalName).forEach(schedule => schedule.team1 = team.name);
        this.tournament.schedule.filter(schedule => schedule.team2 === team.originalName).forEach(schedule => schedule.team2 = team.name);
      }
      if (this.tournament.table) {
        this.tournament.table.filter(table => table.team === team.originalName).forEach(table => table.team = team.name);
      }
      if (this.tournament.tournamentSchedule) {
        this.tournament.tournamentSchedule.forEach(round => {
          round.schedule.filter(game => game.team1 === team.originalName).forEach(game => game.team1 = team.name);
          round.schedule.filter(game => game.team2 === team.originalName).forEach(game => game.team2 = team.name);
        });
      }
    });
  }

  private generateSchedule(): void {
    if (this.tournament.mode === 'league') {
      this.generateRoundRobinTournamentSchedule();
      this.insertTable();
    } else {
      this.generateKoTournamentSchedule();
    }
  }

  private insertTable(): void {
    for (let team of this.tournament.teams) {
      this.tournament.table.push(new Table(team.name));
    }
  }

  private generateRoundRobinTournamentSchedule(teams?: Team[], cancel?: boolean) {
    this.tournament.schedule = [];
    this.tournament.table = [];
    this.tournament.tournamentSchedule = null;

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
    this.tournament.tournamentSchedule = [];
    this.tournament.table = null;
    this.tournament.schedule = null;
    let schedule: Schedule[] = [];
    const teams = this.tournament.teams.map(x => Object.assign({}, x));

    // regularTeams ist die Zahl, die angibt wie viele Mannschaften teilnehmen müssen, damit das Turnier aufgeht
    const regularTeams = this.getNumberGames(teams.length);
    const numberBye = regularTeams - teams.length;
    const playedGames = regularTeams / 2 - numberBye;
    let scheduledGames = 0;

    while (teams.length > 1 && scheduledGames < playedGames) {
      let randomNumber = Math.floor(Math.random() * teams.length);
      const team1 = teams[randomNumber];
      teams.splice(randomNumber, 1);
      randomNumber = Math.floor(Math.random() * teams.length)
      const team2 = teams[randomNumber];
      schedule.push(new Schedule(team1.name, team2.name));
      teams.splice(randomNumber, 1);
      scheduledGames++;
    }

    for (let i = 0; i < numberBye; i++) {
      let randomNumber = Math.floor(Math.random() * teams.length);
      const team = teams[randomNumber];
      schedule.push(new Schedule(team.name, 'Freilos'));
      teams.splice(randomNumber, 1);
    }
    if (numberBye > 1) {
      this.shuffleBye(schedule, numberBye);
    }
    this.tournament.tournamentSchedule.push(new Round(1, schedule));
    this.createEmptyRounds(2);
  }

  private shuffleBye(schedule: Schedule[], numberBye: number): void {
    const regularGames = schedule.length - numberBye;
    for (let i = 0; i <= regularGames; i++) {
      if (i % 2 === 0) {
        schedule.splice(i, 0, schedule.pop());
      }
    }
  }

  private createEmptyRounds(roundNumber: number): void {
    const prevRound = this.tournament.tournamentSchedule.find(round => round.roundNumber === roundNumber - 1);
    let schedule: Schedule[] = [];
    
    for (let i = 0; i < prevRound.schedule.length / 2; i++) {
      let team1 = '';
      let team2 = '';
      let index = i * 2;
      if (this.tournament.tournamentSchedule[0].schedule[index].team2 === 'Freilos') {
        team1 = this.tournament.tournamentSchedule[0].schedule[index].team1;
      }
      index++;
      if (this.tournament.tournamentSchedule[0].schedule[index].team2 === 'Freilos') {
        team2 = this.tournament.tournamentSchedule[0].schedule[index].team1;
      }
      schedule.push(new Schedule(team1, team2));
    }
    this.tournament.tournamentSchedule.push(new Round(roundNumber, schedule));
    if (schedule.length > 1) {
      this.createEmptyRounds(roundNumber + 1);
    }

  }

  private getNumberGames(teams: number): number {
    for (let n of this.singleElimination) {
      if (n - teams > 0 || n - teams === 0) {
        return n;
      }
    }
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