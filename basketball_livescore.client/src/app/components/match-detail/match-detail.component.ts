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
  match: Match | undefined;
  fouls: Foul[] = [];
  playerScores: PlayerScore[] = [];
  timeouts: Timeout[] = []; // Liste des timeouts
  players: Player[] = []; // Liste des joueurs

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private foulService: FoulService,
    private playerScoreService: ScoreService,
    private timeoutService: TimeoutService,
    private playerService: PlayerService // Ajout du service des joueurs
  ) { }

  ngOnInit(): void {
    this.loadMatch();
    this.loadFouls();
    this.loadPlayerScores();
    this.loadTimeouts(); // Chargez les timeouts
    this.loadPlayers(); // Charger les joueurs
  }

  loadMatch(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')!);
    this.matchService.getMatch(id).subscribe(
      (data: Match) => {
        this.match = data;
      },
      error => {
        console.error('Error loading match', error);
      }
    );
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
