import { Schedule } from './schedule';

export class Round {
  constructor(public roundNumber: number, public schedule: Schedule[]) { }
}