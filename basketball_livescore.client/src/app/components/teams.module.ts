import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamFormComponent } from './team-form/team-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TeamFormComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    ReactiveFormsModule
  ]
})
export class TeamsModule { }
