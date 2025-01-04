import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { FoulService } from '../../services/foul.service';
import { Match } from '../../services/match.model';
import { Foul } from '../../services/foul.model';
import { PlayerScore } from '../player-score.model';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  match: Match | undefined;
  fouls: Foul[] = [];
  playerScores: PlayerScore[] = []; // Liste des scores des joueurs

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private foulService: FoulService,
    private playerScoreService: ScoreService
  ) { }

  ngOnInit(): void {
    this.loadMatch();
    this.loadFouls();
    this.loadPlayerScores();
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
}
