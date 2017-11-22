import { Team } from './team';

export class Tournament {
  name: string;
  teams?: Team[];

  constructor() {
    this.name = '';
   }
}