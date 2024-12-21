import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchFormComponent } from './match-form/match-form.component';

const routes: Routes = [
  { path: 'create', component: MatchFormComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule { }
