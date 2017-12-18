export class Team {
  league: number;
  name: string;

  constructor(public originalName?: string) {
    this.name = '';
    this.league = 1;
  }
}