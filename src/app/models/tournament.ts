import { Team } from './team';

export class Tournament {
  teams?: Team[];
  oldName?: string;

  constructor(public name: string = '') { }
}