import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../services/match.model';
import { NewsService, NewsItem } from '../../services/news.service';
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
  topNews: NewsItem[] = [];
  MatchStatus = MatchStatus;

  constructor(
    private matchService: MatchService, 
    private newsService: NewsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMatches();
    this.loadUpcomingEspnMatches();
    this.loadNews();

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

  loadNews() {
    this.newsService.getTopNews().subscribe(news => {
      const fallbackImages = [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop'
      ];
      // Take top 3 for the grid and assign different images
      this.topNews = news.slice(0, 3).map((item, index) => ({
        ...item,
        thumbnail: fallbackImages[index]
      }));
      this.cdr.markForCheck();
    });
  }

  scrollToLive() {
    document.getElementById('live-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  trackByMatchId(index: number, match: Match): number {
    return match.id;
  }

  trackByEspnId(index: number, ev: any): string {
    return ev.id;
  }

  openLink(link: string | undefined) {
    if (link) window.open(link, '_blank');
  }
}
