export class Schedule {
  constructor(public team1: string, public team2: string, public league: number = 1, public saved: boolean = false, public goals1?: number, public goals2?: number) { }
}