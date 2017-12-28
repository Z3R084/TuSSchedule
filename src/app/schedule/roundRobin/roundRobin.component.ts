import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Schedule } from '../../models/schedule';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';
import { Round } from '../../models/round';
import { Table } from '../../models/table';

@Component({
  selector: 'round-robin',
  templateUrl: './roundRobin.component.html',
  styleUrls: ['../schedule.component.css']
})
export class RoundRobinComponent implements OnInit {
  @Input('schedule') tournament: Tournament;
  @ViewChild('scheduleForm') scheduleForm: NgForm;
  originalSchedule: Schedule[];
  multiLeague: boolean;
  shownSchedule: Round = null;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.originalSchedule = this.tournament.schedule.map(x => Object.assign({}, x));
    const gameLeague2 = this.tournament.schedule.filter(game => game.league === 2);
    this.multiLeague = (gameLeague2.length > 0) ? true : false;
    this.shownSchedule = null;
  }

  changeView(round: Round): void {
    this.shownSchedule = round;
    // this.scheduleForm.resetForm(this.scheduleForm.value);
  }

  onSubmit() {
    if (this.shownSchedule === null) {
      this.tournamentService.updateSchedule(this.tournament.schedule, this.originalSchedule).subscribe(() => {
        this.originalSchedule = this.tournament.schedule.map(x => Object.assign({}, x));
      });
    } else {
      this.fillNextRound();
      this.tournamentService.updateSchedule().subscribe();
    }
    this.scheduleForm.resetForm(this.scheduleForm.value);
  }

  private fillNextRound(): void {
    this.shownSchedule.schedule.forEach((game, index) => {
      if (game.goals1 && game.goals2) {
        game.goals1 = parseInt(<any>game.goals1);
        game.goals2 = parseInt(<any>game.goals2);
        const newIndex = Math.floor(index / 2);
        const winner = (game.goals1 > game.goals2) ? game.team1 : game.team2;
        let nextRound = this.tournament.tournamentSchedule.find(round => round.roundNumber === this.shownSchedule.roundNumber + 1);
        if (nextRound) {
          if (index % 2 === 0) {
            nextRound.schedule[newIndex].team1 = winner;
          } else {
            nextRound.schedule[newIndex].team2 = winner;
          }
        }
      }
    });
  }
}