import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamFormComponent } from './team-form/team-form.component';

const routes: Routes = [
  { path: 'create', component: TeamFormComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
