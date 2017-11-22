import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { StandingsComponent } from './standings/standings.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AdminComponent } from './admin/admin.component';
import { TeamsComponent } from './admin/teams/teams.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/teams', component: TeamsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }