import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerFormComponent } from './player-form/player-form.component';

const routes: Routes = [
  { path: 'create', component: PlayerFormComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' } // Redirigez vers le formulaire de création par défaut
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
