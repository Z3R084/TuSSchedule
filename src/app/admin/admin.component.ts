import { Component } from '@angular/core';

import { MemoryService } from '../memory.service';
import { Team } from '../team';

@Component({
  selector: 'tus-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {
  constructor(private memoryService: MemoryService) {}

  test(): void {
    const team: Team = {
      id: 1,
      name: 'TuS'
    };

    this.memoryService.addJson(team).subscribe(t => {
      console.log(t);
    });
  }
 }