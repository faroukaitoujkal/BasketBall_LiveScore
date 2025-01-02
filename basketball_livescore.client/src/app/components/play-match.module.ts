import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayMatchComponent } from './play-match/play-match.component';
import { PlayMatchRoutingModule } from './play-match-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';  

@NgModule({
  declarations: [
    PlayMatchComponent
  ],
  imports: [
    CommonModule,
    PlayMatchRoutingModule,
    ReactiveFormsModule,
    FormsModule  
  ]
})
export class PlayMatchModule { }
