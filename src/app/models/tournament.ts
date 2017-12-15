import { Team } from './team';
import { Schedule } from './schedule';

export class Tournament {
  teams?: Team[];
  oldName?: string;
  mode?: string;
  schedule?: Schedule[];
  classificationMode?: string;

  constructor(public name: string = '', public secondRound: boolean = false) { }
}