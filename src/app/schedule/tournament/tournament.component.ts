import { Component, Input, OnInit } from '@angular/core';

import { Round } from '../../models/round';
import { Schedule } from '../../models/schedule';

@Component({
  selector: 'tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['../schedule.component.css']
})
export class TournamentComponent implements OnInit {
  @Input() schedule: Round[];
  shownSchedule: Schedule[];

  constructor() { }

  ngOnInit() {
    this.shownSchedule = this.schedule[0].schedule;
   }
}