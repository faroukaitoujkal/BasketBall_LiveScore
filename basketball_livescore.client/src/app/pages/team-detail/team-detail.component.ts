import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../services/team.model';
import { Player } from '../../services/player.model';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './team-detail.component.html'
})
export class TeamDetailComponent implements OnInit {
  team: Team | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teamService.getTeam(+id).subscribe(
        (data: any) => {
          this.team = data;
          this.loading = false;
        },
        (error: any) => {
          console.error('Error fetching team details', error);
          this.loading = false;
        }
      );
    }
  }
}
