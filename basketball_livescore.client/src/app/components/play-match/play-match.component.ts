import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { TimeoutService, TimeoutMatch } from '../../services/timeout.service';
import { FoulService, Foul } from '../../services/foul.service';
import { PlayerService } from '../../services/player.service';
import { ScoreService } from '../../services/score.service';
import { SubstitutionService } from '../../services/substitution.service';
import { Match } from '../../services/match.model';
import { Player } from '../../services/player.model';
import { PlayerScore } from '../player-score.model';
import { Substitution } from '../substitution.model';

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

  matchId!: number; // MatchId sera initialisé dynamiquement
  quarter: number = 1;
  timeoutDuration: number = 60;
  timeouts: TimeoutMatch[] = [];
  homeTeamId: number = 0;
  awayTeamId: number = 0;
  location: string = '';
  encodedBy: string = '';

  homePlayers: Player[] = [];
  awayPlayers: Player[] = [];
  allPlayers: Player[] = [];

  substitution: Substitution = {
    id: 0,
    playerInId: 0,
    playerOutId: 0,
    quarter: 1,
    gameTime: '00:00',
  };

  selectedPlayerId: number = 0;
  selectedPoints: number = 1;

  homeTeamScore: number = 0;
  awayTeamScore: number = 0;

  homeTeamName: string = '';
  awayTeamName: string = '';

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
    matchId: 0, // Mis à jour dynamiquement
  };

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres d'URL
    private substitutionService: SubstitutionService,
    private scoreService: ScoreService,
    private matchService: MatchService,
    private timeoutService: TimeoutService,
    private playerService: PlayerService,
    private foulService: FoulService
  ) { }

  ngOnInit(): void {
    // Récupérer le matchId depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchId = +id; // Convertir en nombre
      this.foul.matchId = this.matchId; // Assigner à l'objet `foul`
      this.loadMatchDetails(); // Charger les détails du match
      this.loadScores();
    } else {
      console.error('No match ID provided in the route.');
    }
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

      // Charger les noms des équipes
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
    this.playerService.getPlayersByTeam(this.homeTeamId).subscribe((homePlayers: Player[]) => {
      this.homePlayers = homePlayers.slice(0, 5);
      this.updateAllPlayers();
    });

    this.playerService.getPlayersByTeam(this.awayTeamId).subscribe((awayPlayers: Player[]) => {
      this.awayPlayers = awayPlayers.slice(0, 5);
      this.updateAllPlayers();
    });
  }

  loadScores(): void {
    this.matchService.getMatchScores(this.matchId).subscribe(
      (scores) => {
        this.homeTeamScore = scores.homeTeamScore;
        this.awayTeamScore = scores.awayTeamScore;
      },
      (error) => {
        console.error('Erreur lors du chargement des scores:', error);
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

  recordSubstitution(): void {
    const substitutionData: Substitution = {
      playerInId: this.substitution.playerInId,
      playerOutId: this.substitution.playerOutId,
      quarter: this.substitution.quarter,
      gameTime: this.substitution.gameTime,
      id: 0, // ID automatique côté serveur
    };

    this.substitutionService.recordSubstitution(substitutionData).subscribe(
      (response) => {
        console.log('Substitution enregistrée avec succès:', response);
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de la substitution:', error);
      }
    );
  }
}
