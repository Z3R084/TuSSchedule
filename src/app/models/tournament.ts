import { Team } from './team';
import { Schedule } from './schedule';

export class Tournament {
  teams?: Team[];
  oldName?: string;
  mode?: string;
  schedule?: Schedule[];

  constructor(public name: string = '') { }
}