import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Schedule } from '../../models/schedule';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'round-robin',
  templateUrl: './roundRobin.component.html',
  styleUrls: ['../schedule.component.css']
})
export class RoundRobinComponent {
  @Input() schedule: Schedule[];
  @ViewChild('scheduleForm') scheduleForm: NgForm;

  constructor(private tournamentService: TournamentService) { }

  onSubmit() {
    this.tournamentService.updateSchedule(this.schedule).subscribe();
    this.scheduleForm.resetForm(this.scheduleForm.value);
  }
}