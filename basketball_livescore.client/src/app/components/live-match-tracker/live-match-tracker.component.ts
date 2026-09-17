import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../services/match.model';
import { SignalrService } from '../../services/signalr.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-live-match-tracker',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './live-match-tracker.component.html'
})
export class LiveMatchTrackerComponent implements OnInit, OnDestroy {
  match: Match | null = null;
  loading = true;
  MatchStatus = MatchStatus;
  
  private messageSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private signalRService: SignalrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(+id);
      
      this.signalRService.startConnection(+id);
      
      this.messageSubscription = this.signalRService.messageReceived$.subscribe((message: any) => {
        // Simple refresh strategy when ANY message is received.
        // A more advanced app would parse the message to see if it's for this match.
        this.loadMatch(+id, false);
      });
    }
  }

  loadMatch(id: number, showLoading = true) {
    if (showLoading) this.loading = true;
    
    this.matchService.getMatch(id).subscribe(
      (data: any) => {
        this.match = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading match', error);
        this.loading = false;
      }
    );
  }

  simulateScore(team: 'home' | 'away', points: number) {
    if (!this.match) return;
    
    // Simulate updating locally for instant feedback
    if (team === 'home') this.match.homeTeamScore += points;
    else this.match.awayTeamScore += points;
    
    // If we had a ScoreService, we would call it here.
    // For now, it's just simulating the front-end logic as requested.
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
