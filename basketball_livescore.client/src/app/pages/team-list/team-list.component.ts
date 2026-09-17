import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { Team } from '../../services/team.model';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './team-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];

  constructor(private teamService: TeamService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.teamService.getTeams().subscribe((data: any) => {
      this.teams = data;
      this.cdr.markForCheck();
    });
  }

  trackByTeamId(index: number, team: Team): number {
    return team.id;
  }
}
