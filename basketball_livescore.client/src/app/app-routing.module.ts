import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'players', loadChildren: () => import('./components/players.module').then(m => m.PlayersModule) },
  { path: 'teams', loadChildren: () => import('./components/teams.module').then(m => m.TeamsModule) },
  { path: '', redirectTo: '/teams', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
