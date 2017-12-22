export class Table {
  constructor(public team: string, public won: number = 0, public lost: number = 0, public drawn: number = 0,
    public goalsFor: number = 0, public goalsAgainst: number = 0, public points: number = 0) { }
}