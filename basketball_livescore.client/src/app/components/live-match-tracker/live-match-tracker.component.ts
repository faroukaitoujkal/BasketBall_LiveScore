import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../services/match.model';
import { SignalrService } from '../../services/signalr.service';
import { Player } from '../../services/player.model';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  
  recentEvents: any[] = [];
  selectedHomePlayerId: number | null = null;
  selectedAwayPlayerId: number | null = null;
  isSubmitting = false;

  private scoreSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private signalRService: SignalrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(+id);
      
      this.signalRService.startConnection(+id);
      
      this.scoreSubscription = this.signalRService.scoreUpdated$.subscribe((data: any) => {
        if (data && data.matchId === +id) {
           this.handleScoreUpdate(data);
           this.cdr.detectChanges();
        }
      });
    }
  }

  loadMatch(id: number, showLoading = true) {
    if (showLoading) this.loading = true;
    
    // Fetch match and historical scores simultaneously
    forkJoin({
      match: this.matchService.getMatch(id),
      scores: this.matchService.getHistoricalScores(id).pipe(
        catchError(() => of([]))
      )
    }).subscribe({
      next: (res: any) => {
        this.match = res.match;
        
        // Setup default selected players for the encoder panel
        if (this.match?.homeTeam?.players?.length && !this.selectedHomePlayerId) {
           this.selectedHomePlayerId = this.match.homeTeam.players[0].id;
        }
        if (this.match?.awayTeam?.players?.length && !this.selectedAwayPlayerId) {
           this.selectedAwayPlayerId = this.match.awayTeam.players[0].id;
        }

        // Map historical scores to our play-by-play events, sorted newest first
        if (res.scores && !res.scores.error) {
          this.recentEvents = res.scores.map((s: any) => this.mapScoreToEvent(s)).sort((a: any, b: any) => b.timestamp - a.timestamp);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading match', err);
        this.loading = false;
      }
    });
  }

  mapScoreToEvent(score: any) {
    let player = score.player;
    let isHome = false;
    let teamName = '';

    // If player is not populated by backend, find it locally
    if (!player && this.match) {
       const homeP = this.match.homeTeam?.players?.find(p => p.id === score.playerId);
       if (homeP) {
          player = homeP;
          isHome = true;
          teamName = this.match.homeTeam?.name || '';
       } else {
          const awayP = this.match.awayTeam?.players?.find(p => p.id === score.playerId);
          if (awayP) {
             player = awayP;
             isHome = false;
             teamName = this.match.awayTeam?.name || '';
          }
       }
    } else {
       isHome = this.match?.homeTeamId === score.player?.teamId;
       teamName = isHome ? this.match?.homeTeam?.name || '' : this.match?.awayTeam?.name || '';
    }

    return {
       id: score.id,
       timestamp: new Date(score.scoreTime).getTime(),
       timeString: new Date(score.scoreTime).toLocaleTimeString(),
       teamName: teamName,
       playerName: player?.name || 'Unknown Player',
       points: score.points,
       isHome: isHome
    };
  }

  handleScoreUpdate(data: any) {
    if (this.match) {
      this.match.homeTeamScore = data.homeTeamScore;
      this.match.awayTeamScore = data.awayTeamScore;
    }
    if (data.playerScore) {
       this.recentEvents.unshift(this.mapScoreToEvent(data.playerScore));
    }
  }

  addRealScore(team: 'home' | 'away', points: number) {
    if (!this.match || this.isSubmitting) return;
    
    const playerId = team === 'home' ? this.selectedHomePlayerId : this.selectedAwayPlayerId;
    if (!playerId) {
       alert("Veuillez sélectionner un joueur.");
       return;
    }

    this.isSubmitting = true;
    this.matchService.addScore({
       matchId: this.match.id,
       playerId: playerId,
       points: points
    }).subscribe({
       next: (res) => {
         this.isSubmitting = false;
         // Note: SignalR will handle the UI update automatically!
       },
       error: (err) => {
         console.error(err);
         this.isSubmitting = false;
         alert("Erreur lors de l'ajout du score.");
       }
    });
  }

  ngOnDestroy(): void {
    if (this.scoreSubscription) {
      this.scoreSubscription.unsubscribe();
    }
  }
}
