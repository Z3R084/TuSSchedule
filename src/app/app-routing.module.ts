import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { StandingsComponent } from './standings/standings.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AdminComponent } from './admin/admin.component';
import { TeamsComponent } from './admin/teams/teams.component';
import { ModeComponent } from './admin/mode/mode.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, data: { state: 'dashboard' } },
  { path: 'standings', component: StandingsComponent, data: { state: 'standings' } },
  { path: 'schedule', component: ScheduleComponent, data: { state: 'schedule' } },
  { path: 'admin', component: AdminComponent, data: { state: 'admin' } },
  { path: 'admin/teams', component: TeamsComponent, data: { state: 'admin/teams' } },
  { path: 'admin/mode', component: ModeComponent, data: { state: 'admin/mode' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }