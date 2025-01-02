import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayMatchComponent } from './play-match/play-match.component';

const routes: Routes = [
  { path: 'create', component: PlayMatchComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayMatchRoutingModule { }
