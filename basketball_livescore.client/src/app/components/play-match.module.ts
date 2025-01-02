import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayMatchComponent } from './play-match/play-match.component';
import { PlayMatchRoutingModule } from './play-match-routing.module';

@NgModule({
  declarations: [
    PlayMatchComponent
  ],
  imports: [
    CommonModule,
    PlayMatchRoutingModule,
  ]
})
export class PlayMatchModule { }
