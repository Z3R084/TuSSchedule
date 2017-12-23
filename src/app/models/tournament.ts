import { Team } from './team';
import { Schedule } from './schedule';
import { Table } from './table';
import { Round } from './round';

export class Tournament {
  teams?: Team[];
  oldName?: string;
  mode?: string;
  schedule?: Schedule[];
  tournamentSchedule?: Round[];
  classificationMode?: string;
  table?: Table[];

  constructor(public name: string = '', public secondRound: boolean = false) { }
}