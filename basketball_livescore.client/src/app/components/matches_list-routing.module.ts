import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchesListComponent } from './match-list/match-list.component';

const routes: Routes = [
  { path: 'create', component: MatchesListComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesListRoutingModule { }
