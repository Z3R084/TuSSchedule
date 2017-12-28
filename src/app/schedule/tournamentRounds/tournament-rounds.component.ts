import { Component, Input, OnInit } from '@angular/core';
import { Round } from '../../models/round';

@Component({
  selector: 'tournament-rounds',
  templateUrl: './tournament-rounds.component.html',
  styleUrls: ['../schedule.component.css']
})

export class TournamentRoundsComponent implements OnInit {
  @Input() schedule: Round[];
  shownSchedule: Round;

  ngOnInit() {
    this.shownSchedule = this.schedule[0];
  }

  changeView(round: Round): void {
    this.shownSchedule = round;
    // this.scheduleForm.resetForm(this.scheduleForm.value);
  }
}