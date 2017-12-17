import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StandingsComponent } from './standings/standings.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AdminComponent } from './admin/admin.component';
import { TeamsComponent } from './admin/teams/teams.component';
import { ModeComponent } from './admin/mode/mode.component';
import { RoundRobinComponent } from './schedule/roundRobin/roundRobin.component';
import { MessagesComponent } from './messages/messages.component';

import { MemoryService } from './memory.service';
import { TournamentService } from './services/tournament.service';
import { MessageService } from './services/message.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    StandingsComponent,
    ScheduleComponent,
    AdminComponent,
    TeamsComponent,
    ModeComponent,
    RoundRobinComponent,
    MessagesComponent
  ],
  providers: [
    MemoryService,
    TournamentService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
