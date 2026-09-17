import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingService } from '../../services/standing.service';
import { Standing } from '../../services/standing.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './standings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandingsComponent implements OnInit {
  standings: Standing[] = [];

  constructor(private standingService: StandingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.standingService.getStandings().subscribe((data: any) => {
      this.standings = data;
      this.cdr.markForCheck();
    });
  }

  trackByTeamId(index: number, standing: Standing): number {
    return standing.teamId;
  }
}
