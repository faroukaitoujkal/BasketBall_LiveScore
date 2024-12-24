import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchDetailComponent } from './match-detail/match-detail.component';

const routes: Routes = [
  { path: 'create', component: MatchDetailComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesDetailsRoutingModule { }
