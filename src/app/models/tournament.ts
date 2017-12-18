import { Team } from './team';
import { Schedule } from './schedule';
import { Table } from './table';

export class Tournament {
  teams?: Team[];
  oldName?: string;
  mode?: string;
  schedule?: Schedule[];
  classificationMode?: string;
  table?: Table[];

  constructor(public name: string = '', public secondRound: boolean = false) { }
}