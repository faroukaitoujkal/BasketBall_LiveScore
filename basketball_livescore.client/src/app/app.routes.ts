import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StandingsComponent } from './pages/standings/standings.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { LiveMatchTrackerComponent } from './components/live-match-tracker/live-match-tracker.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/:id', component: TeamDetailComponent },
  { path: 'matches/:id', component: LiveMatchTrackerComponent },
  { path: '**', redirectTo: '' }
];
