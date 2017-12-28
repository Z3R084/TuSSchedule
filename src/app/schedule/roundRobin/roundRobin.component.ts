import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Schedule } from '../../models/schedule';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament';
import { Round } from '../../models/round';

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
    this.tournamentService.updateSchedule(this.tournament.schedule, this.originalSchedule).subscribe(() => {
      this.originalSchedule = this.tournament.schedule.map(x => Object.assign({}, x));
    });
    this.scheduleForm.resetForm(this.scheduleForm.value);
  }
}