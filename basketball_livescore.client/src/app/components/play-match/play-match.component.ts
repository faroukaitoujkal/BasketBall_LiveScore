import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { TimeoutService, TimeoutMatch } from '../../services/timeout.service';
import { FoulService, Foul } from '../../services/foul.service';
import { Match } from '../../services/match.model';
import { Player } from '../../services/player.model';
import { PlayerService } from '../../services/player.service';
import { ScoreService } from '../../services/score.service';
import { PlayerScore } from '../player-score.model';

@Component({
  selector: 'app-play-match',
  templateUrl: './play-match.component.html',
  styleUrls: ['./play-match.component.css'],
})
export class PlayMatchComponent implements OnInit {
  timer: number = 0;
  intervalId: any = null;
  isRunning: boolean = false;
  isTimeoutInProgress: boolean = false;

  matchId: number = 1;
  quarter: number = 1;
  timeoutDuration: number = 60;
  timeouts: TimeoutMatch[] = [];
  homeTeamId: number = 0;
  awayTeamId: number = 0;
  location: string = '';
  encodedBy: string = '';

  homePlayers: Player[] = [];
  awayPlayers: Player[] = [];
  allPlayers: Player[] = []; // Liste combinée des joueurs

  selectedPlayerId: number = 0;
  selectedPoints: number = 1;

  homeTeamScore: number = 0;
  awayTeamScore: number = 0;

  homeTeamName: string = 'Équipe à Domicile';
  awayTeamName: string = 'Équipe Extérieure';

  foul: Foul = {
    player: {
      id: 0,
      name: '',
      number: 0,
      teamId: 0,
    },
    quarter: 1,
    gameTime: '00:00',
    foulType: 'P0',
    id: 0,
    playerId: 0,
    matchId: this.matchId,
  };

  constructor(
    private scoreService: ScoreService,
    private matchService: MatchService,
    private timeoutService: TimeoutService,
    private playerService: PlayerService,
    private foulService: FoulService
  ) { }

  ngOnInit(): void {
    this.loadMatchDetails();
    this.loadScores();
  }

  startTimer(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if (!this.isTimeoutInProgress) {
          this.timer++;
        }
      }, 1000);
    }
  }

  stopTimer(): void {
    if (this.isRunning) {
      clearInterval(this.intervalId);
      this.isRunning = false;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  loadMatchDetails(): void {
    this.matchService.getMatch(this.matchId).subscribe((match: Match) => {
      this.timeoutDuration = match.timeoutDuration * 60;
      this.homeTeamId = match.homeTeamId;
      this.awayTeamId = match.awayTeamId;
      this.location = match.location;
      this.encodedBy = match.encodedBy || 'default@example.com';

      // Récupérer les noms des équipes
      this.matchService.getTeamName(this.homeTeamId).subscribe((teamName: string) => {
        this.homeTeamName = teamName;
      });

      this.matchService.getTeamName(this.awayTeamId).subscribe((teamName: string) => {
        this.awayTeamName = teamName;
      });

      this.loadPlayers();
      this.loadTimeouts();
    });
  }

  loadTimeouts(): void {
    this.timeoutService.getTimeoutsByMatch(this.matchId).subscribe((timeouts: TimeoutMatch[]) => {
      this.timeouts = timeouts;
    });
  }

  loadPlayers(): void {
    // Charger les joueurs des deux équipes en une seule opération
    this.playerService.getPlayersByTeam(this.homeTeamId).subscribe((homePlayers: Player[]) => {
      this.homePlayers = homePlayers.slice(0, 5); // Prendre les 5 premiers joueurs
      this.updateAllPlayers();
    });

    this.playerService.getPlayersByTeam(this.awayTeamId).subscribe((awayPlayers: Player[]) => {
      this.awayPlayers = awayPlayers.slice(0, 5); // Prendre les 5 premiers joueurs
      this.updateAllPlayers();
    });
  }

  loadScores(): void {
    this.matchService.getMatchScores(this.matchId).subscribe(
      (scores) => {
        console.log('Scores récupérés avec succès:', scores);
        this.homeTeamScore = scores.homeTeamScore;
        this.awayTeamScore = scores.awayTeamScore;
      },
      (error) => {
        console.error('Erreur lors du chargement des scores:', error);
        console.log('Détails de l\'erreur:', error.message);
      }
    );
  }

  updateAllPlayers(): void {
    this.allPlayers = [...this.homePlayers, ...this.awayPlayers];
  }

  createTimeoutForMatch(matchId: number): void {
    const timeoutData = {
      Match: {
        HomeTeamId: this.homeTeamId,
        AwayTeamId: this.awayTeamId,
        TimeoutDuration: this.timeoutDuration / 60,
        Location: this.location,
        EncodedBy: this.encodedBy,
      },
      quarter: this.quarter,
      gameTime: this.formatTime(this.timer),
      duration: this.formatTime(this.timeoutDuration),
    };

    this.isTimeoutInProgress = true;
    this.stopTimer();

    this.timeoutService.createTimeoutFromMatch(matchId, timeoutData).subscribe(
      (response) => {
        this.loadTimeouts();
        setTimeout(() => {
          this.isTimeoutInProgress = false;
          this.startTimer();
        }, this.timeoutDuration * 1000);
      },
      (error) => {
        this.isTimeoutInProgress = false;
        this.startTimer();
      }
    );
  }

  recordScore(): void {
    console.log('Début de la méthode recordScore');

    // Recherche du joueur sélectionné
    const selectedPlayer = this.allPlayers.find(
      (player) => Number(player.id) === Number(this.selectedPlayerId)
    );

    console.log('Joueur sélectionné:', selectedPlayer);

    // Vérification si le joueur est trouvé
    if (!selectedPlayer || selectedPlayer.id === undefined) {
      console.error('Joueur non trouvé');
      return;
    }

    // Convertir selectedPoints en nombre
    this.selectedPoints = Number(this.selectedPoints);

    // Vérification si les points sont valides
    console.log('selectedPoints:', this.selectedPoints);
    console.log('selectedPoints type:', typeof this.selectedPoints);

    if (![1, 2, 3].includes(this.selectedPoints)) {
      console.error('Points invalides, uniquement 1, 2 ou 3 sont valides');
      return;
    }

    // Création de l'objet PlayerScore
    const newScore: PlayerScore = {
      playerId: selectedPlayer.id!,  // ID du joueur
      player: {                       // Infos détaillées sur le joueur
        name: selectedPlayer.name,
        number: selectedPlayer.number,
        teamId: selectedPlayer.teamId,
      },
      points: this.selectedPoints,     // Points marqués
      scoreTime: new Date().toISOString(),  // Heure du score
      matchId: this.matchId,           // ID du match
    };

    console.log('Création du score:', newScore);

    // Appel au service pour ajouter le score
    this.scoreService.addScore(newScore).subscribe(
      (response) => {
        console.log('Score enregistré avec succès:', response);
        this.loadScores(); // Recharger les scores après l'ajout
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement du score:", error);
        console.log('Détails de l\'erreur:', error);
      }
    );

    console.log('Fin de la méthode recordScore');
  }

  recordFoul(): void {
    const selectedPlayer = [...this.homePlayers, ...this.awayPlayers].find(
      (player) => Number(player.id) === Number(this.foul.player.id)
    );

    if (selectedPlayer && selectedPlayer.id !== undefined) {
      const newFoul: Foul = {
        playerId: selectedPlayer.id,
        player: {
            name: selectedPlayer.name,
            number: selectedPlayer.number,
            teamId: selectedPlayer.teamId,
            id: 0
        },
        quarter: this.foul.quarter,
        gameTime: this.foul.gameTime,
        foulType: this.foul.foulType,
        id: this.foul.id,
        matchId: this.matchId,
      };

      this.foulService.createFoul(newFoul).subscribe(
        (response) => {
          console.log('Faute enregistrée avec succès:', response);
        },
        (error) => {
          console.error('Erreur lors de l\'enregistrement de la faute:', error);
        }
      );
    } else {
      console.error('Joueur non trouvé ou ID invalide!');
    }
  }
}
