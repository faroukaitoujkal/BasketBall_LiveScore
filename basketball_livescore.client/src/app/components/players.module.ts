import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersRoutingModule } from './players-routing.module';
import { PlayerFormComponent } from './player-form/player-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PlayerFormComponent
  ],
  imports: [
    CommonModule,
    PlayersRoutingModule,
    ReactiveFormsModule
  ]
})
export class PlayersModule { }
