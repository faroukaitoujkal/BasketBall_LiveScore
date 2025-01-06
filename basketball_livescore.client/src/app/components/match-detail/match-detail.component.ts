import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { FoulService } from '../../services/foul.service';
import { TimeoutService } from '../../services/timeout.service';
import { Match } from '../../services/match.model';
import { Foul } from '../../services/foul.model';
import { ScoreService } from '../../services/score.service';
import { Timeout } from '../../services/timeout.model';
import { Player } from '../../services/player.model';
import { PlayerService } from '../../services/player.service';
import { PlayerScore } from '../../services/player-score.model';

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
  homeTeamId: number = 0;
  awayTeamId: number = 0;
  homePlayers: Player[] = [];
  awayPlayers: Player[] = [];

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
                this.homeTeamId = this.match.homeTeamId; // Mise à jour de l'ID de l'équipe à domicile
              }
            });

            this.matchService.getTeamName(this.match.awayTeamId).subscribe((name: string) => {
              if (this.match) {
                this.match.awayTeam = { id: this.match.awayTeamId, name } as any;
                this.awayTeamId = this.match.awayTeamId; // Mise à jour de l'ID de l'équipe à l'extérieur
                // Charger les joueurs après que les équipes ont été définies
                if (this.awayTeamId > 0) {
                  this.loadPlayers(); // Charge les joueurs seulement une fois toutes les équipes définies
                } else {
                  console.warn('Invalid away team ID');
                }
              }
            });
          }

          this.loadMatchDetails();
          this.loadFouls();
          this.loadPlayerScores();
          this.loadTimeouts();
          this.loadMatchScores();
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

  loadMatchDetails(): void {
    this.matchService.getMatch(this.matchIdd).subscribe((match: Match) => {
      this.homeTeamId = match.homeTeamId;
      this.awayTeamId = match.awayTeamId;
    });
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
    if (this.homeTeamId > 0) {
      this.playerService.getPlayersByTeam(this.homeTeamId).subscribe((homePlayers: Player[]) => {
        this.homePlayers = homePlayers.slice(0, 5);
      }, error => {
        console.error('Error loading home team players', error);
      });
    } else {
      console.warn('Invalid home team ID');
    }

    if (this.awayTeamId > 0) {
      this.playerService.getPlayersByTeam(this.awayTeamId).subscribe((awayPlayers: Player[]) => {
        this.awayPlayers = awayPlayers.slice(0, 5);
      }, error => {
        console.error('Error loading away team players', error);
      });
    } else {
      console.warn('Invalid away team ID');
    }

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
