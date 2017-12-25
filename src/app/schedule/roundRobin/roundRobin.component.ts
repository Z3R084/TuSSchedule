import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Schedule } from '../../models/schedule';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'round-robin',
  templateUrl: './roundRobin.component.html',
  styleUrls: ['../schedule.component.css']
})
export class RoundRobinComponent implements OnInit {
  @Input() schedule: Schedule[];
  @ViewChild('scheduleForm') scheduleForm: NgForm;
  originalSchedule: Schedule[];
  multiLeague: boolean;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.originalSchedule = this.schedule.map(x => Object.assign({}, x));
    const gameLeague2 = this.schedule.filter(game => game.league === 2);
    this.multiLeague = (gameLeague2.length > 0) ? true : false;
  }

  onSubmit() {
    this.tournamentService.updateSchedule(this.schedule, this.originalSchedule).subscribe(() => {
      this.originalSchedule = this.schedule.map(x => Object.assign({}, x));
    });
    this.scheduleForm.resetForm(this.scheduleForm.value);
  }
}