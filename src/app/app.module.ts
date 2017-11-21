import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StandingsComponent } from './standings/standings.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    StandingsComponent,
    ScheduleComponent,
    AdminComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
