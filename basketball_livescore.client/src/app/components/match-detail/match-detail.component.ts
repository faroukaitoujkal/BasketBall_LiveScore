import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { FoulService } from '../../services/foul.service';
import { TimeoutService } from '../../services/timeout.service'; 
import { Match } from '../../services/match.model';
import { Foul } from '../../services/foul.model';
import { PlayerScore } from '../player-score.model';
import { ScoreService } from '../../services/score.service';
import { Timeout } from '../../services/timeout.model';
import { Player } from '../../services/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  match: Match | null = null;
  matchIdd!: number; // MatchId sera initialisé dynamiquement
  fouls: Foul[] = [];
  playerScores: PlayerScore[] = [];
  timeouts: Timeout[] = []; // Liste des timeouts
  players: Player[] = []; // Liste des joueurs
  homeTeamScore: number = 0;
  awayTeamScore: number = 0;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private foulService: FoulService,
    private playerScoreService: ScoreService,
    private timeoutService: TimeoutService,
    private playerService: PlayerService 
  ) { }

  ngOnInit(): void {
    this.loadMatch();
    this.loadFouls();
    this.loadPlayerScores();
    this.loadTimeouts(); // Chargez les timeouts
    this.loadPlayers(); // Charger les joueurs
  }

  loadMatch(): void {
    const matchId = this.route.snapshot.paramMap.get('id');
    if (matchId !== null) {
      this.matchIdd = +matchId; // Convertir en nombre
      this.matchService.getMatchById(matchId).subscribe({
        next: (data: Match) => {
          this.match = data;

          // Load team names for the match
          if (this.match) {
            this.matchService.getTeamName(this.match.homeTeamId).subscribe((name: string) => {
              if (this.match) {
                this.match.homeTeam = { id: this.match.homeTeamId, name } as any;
              }
            });

            this.matchService.getTeamName(this.match.awayTeamId).subscribe((name: string) => {
              if (this.match) {
                this.match.awayTeam = { id: this.match.awayTeamId, name } as any;
              }
            });
          }

          if (this.matchIdd !== null) {
            this.loadFouls();
            this.loadPlayerScores();
            this.loadTimeouts(); // Chargez les timeouts
            this.loadPlayers(); // Charger les joueurs
            this.loadMatchScores();
          }
        },
        error: (error) => {
          console.error('Error loading match', error);
        },
        complete: () => {
          console.log('Match loaded successfully');
        }
      });
    } else {
      console.error('No match ID provided');
    }
  }

  loadMatchScores(): void {
    if (this.matchIdd !== null) {
      this.matchService.getMatchScores(this.matchIdd).subscribe({
        next: (scores) => {
          this.homeTeamScore = scores.homeTeamScore;
          this.awayTeamScore = scores.awayTeamScore;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des scores:', error);
        },
        complete: () => {
          console.log('Scores chargés avec succès');
        }
      });
    }
  }

  loadFouls(): void {
    const matchId = Number(this.route.snapshot.paramMap.get('id')!);
    this.foulService.getFoulsByMatch(matchId).subscribe(
      (data: Foul[]) => {
        this.fouls = data;
      },
      error => {
        console.error('Error loading fouls', error);
      }
    );
  }

  loadPlayerScores(): void {
    const matchId = Number(this.route.snapshot.paramMap.get('id')!);
    this.playerScoreService.getScoresByMatch(matchId).subscribe(
      (data: PlayerScore[]) => {
        this.playerScores = data;
      },
    );
  }

  loadTimeouts(): void {
    const matchId = Number(this.route.snapshot.paramMap.get('id')!);
    this.timeoutService.getTimeoutsByMatchs(matchId).subscribe(
      (data: Timeout[]) => {
        this.timeouts = data;
      },
      error => {
        console.error('Error loading timeouts', error);
      }
    );
  }

  loadPlayers(): void {
    this.playerService.getPlayers().subscribe(
      (data: Player[]) => {
        this.players = data;
      },
      error => {
        console.error('Error loading players', error);
      }
    );
  }

  getPlayerName(playerId: number): string {
    const player = this.players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  }
}
