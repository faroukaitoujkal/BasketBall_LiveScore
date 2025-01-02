import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./register.module').then(m => m.RegisterModule) },
  { path: 'players', loadChildren: () => import('./players.module').then(m => m.PlayersModule) },
  { path: 'teams', loadChildren: () => import('./teams.module').then(m => m.TeamsModule) },
  { path: 'matches', loadChildren: () => import('./matches.module').then(m => m.MatchesModule) },
  { path: 'matches_list', loadChildren: () => import('./matches_list.module').then(m => m.MatchesListModule) },
  { path: 'matches_list/:id', loadChildren: () => import('./matches_details.module').then(m => m.MatchesDetailsModule) },
  { path: 'play-match/:id', loadChildren: () => import('./play-match.module').then(m => m.PlayMatchModule) },
  { path: '', redirectTo: '/matches_list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
