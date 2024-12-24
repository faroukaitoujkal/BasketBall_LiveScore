import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { MatchesDetailsRoutingModule } from './matches_details-routing.module';

@NgModule({
  declarations: [
    MatchDetailComponent
  ],
  imports: [
    CommonModule,
    MatchesDetailsRoutingModule,
  ]
})
export class MatchesDetailsModule { }
