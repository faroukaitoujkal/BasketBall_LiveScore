import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../services/match.model';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  liveMatches: Match[] = [];
  liveEspnMatches: any[] = [];
  upcomingEspnMatches: any[] = [];
  MatchStatus = MatchStatus;

  constructor(private matchService: MatchService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMatches();
    this.loadUpcomingEspnMatches();

    // Setup an interval to periodically move matches that have started
    setInterval(() => {
      this.checkMatchesTime();
    }, 60000); // check every minute
  }

  loadMatches() {
    this.matchService.getMatches().subscribe(matches => {
      this.liveMatches = matches.filter(m => m.status === MatchStatus.InProgress);
      this.cdr.markForCheck();
    });
  }

  loadUpcomingEspnMatches() {
    this.matchService.getUpcomingMatches().subscribe(response => {
      if (response && response.events) {
        const now = new Date();
        this.liveEspnMatches = response.events.filter((e: any) => new Date(e.date) <= now || e.status.type.state === 'in');
        this.upcomingEspnMatches = response.events.filter((e: any) => new Date(e.date) > now && e.status.type.state === 'pre');
        this.cdr.markForCheck();
      }
    });
  }

  checkMatchesTime() {
    const now = new Date();
    // Move any upcoming match that has reached its time
    const newlyLive = this.upcomingEspnMatches.filter((e: any) => new Date(e.date) <= now);
    if (newlyLive.length > 0) {
      this.liveEspnMatches = [...this.liveEspnMatches, ...newlyLive];
      this.upcomingEspnMatches = this.upcomingEspnMatches.filter((e: any) => new Date(e.date) > now);
      this.cdr.markForCheck();
    }
  }

  trackByMatchId(index: number, match: Match): number {
    return match.id;
  }

  trackByEspnId(index: number, ev: any): string {
    return ev.id;
  }
}
