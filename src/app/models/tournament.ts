import { Team } from './team';

export class Tournament {
  teams?: Team[];
  oldName?: string;
  mode?: string;

  constructor(public name: string = '') { }
}