import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'players', loadChildren: () => import('./components/players.module').then(m => m.PlayersModule) },
  { path: 'teams', loadChildren: () => import('./components/teams.module').then(m => m.TeamsModule) },
  { path: 'matches', loadChildren: () => import('./components/matches.module').then(m => m.MatchesModule) },
  { path: '', redirectTo: '/teams', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
