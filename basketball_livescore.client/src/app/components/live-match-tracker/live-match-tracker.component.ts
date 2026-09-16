import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../services/match.model';
import { SignalrService } from '../../services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-match-tracker',
  standalone: true,
  imports: [CommonModule],
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

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
