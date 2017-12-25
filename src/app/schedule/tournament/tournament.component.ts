import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Round } from '../../models/round';
import { Schedule } from '../../models/schedule';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['../schedule.component.css']
})
export class TournamentComponent implements OnInit {
  @Input() schedule: Round[];
  @ViewChild('scheduleForm') scheduleForm: NgForm;
  shownSchedule: Round;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.shownSchedule = this.schedule[0];
  }

  changeView(round: Round): void {
    this.shownSchedule = round;
    // this.scheduleForm.resetForm(this.scheduleForm.value);
  }

  onSubmit(): void {
    this.fillNextRound();
    this.tournamentService.updateSchedule().subscribe();
    this.scheduleForm.resetForm(this.scheduleForm.value);
  }

  private fillNextRound(): void {
    this.shownSchedule.schedule.forEach((game, index) => {
      if (game.goals1 && game.goals2) {
        game.goals1 = parseInt(<any>game.goals1);
        game.goals2 = parseInt(<any>game.goals2);
        const newIndex = Math.floor(index / 2);
        const winner = (game.goals1 > game.goals2) ? game.team1 : game.team2;
        let nextRound = this.schedule.find(round => round.roundNumber === this.shownSchedule.roundNumber + 1);
        if (index % 2 === 0) {
          nextRound.schedule[newIndex].team1 = winner;
        } else {
          nextRound.schedule[newIndex].team2 = winner;
        }
      }
    });
  }
}