import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesListComponent } from './match-list/match-list.component';
import { MatchesListRoutingModule } from './matches_list-routing.module';

@NgModule({
  declarations: [
    MatchesListComponent
  ],
  imports: [
    CommonModule,
    MatchesListRoutingModule,
  ]
})
export class MatchesListModule { }
