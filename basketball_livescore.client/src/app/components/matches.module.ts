import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchFormComponent } from './match-form/match-form.component';
import { MatchesRoutingModule } from './matches-routing.module';

@NgModule({
  declarations: [
    MatchFormComponent
  ],
  imports: [
    CommonModule,
    MatchesRoutingModule,
    ReactiveFormsModule
  ]
})
export class MatchesModule { }
