import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerFormComponent } from './player-form/player-form.component';

const routes: Routes = [
  { path: 'create', component: PlayerFormComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
