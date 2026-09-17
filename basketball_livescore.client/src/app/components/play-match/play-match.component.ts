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
import { PlayerScore } from '../../services/player-score.model';
import { Substitution } from '../../services/substitution.model';
import { QuarterService } from '../../services/quarter.service';
import { Quarter } from '../../services/quarter.model';
import { SignalrService } from '../../services/signalr.service';

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
  isMatchFinished: boolean = false;

  numberOfQuarters: number = 4; // Par défaut, 4 quart-temps
  quarterDuration: number = 600; // En secondes (10 minutes)
  isQuarterActive: boolean = false; // Si un quart-temps est actif

  matchId!: number; // MatchId sera initialisé dynamiquement
  quarter: number = 1;
  timeoutDuration: number = 60;
  timeouts: TimeoutMatch[] = [];
  homeTeamId: number = 0;
  awayTeamId: number = 0;
  location: string = '';
  matchDate!: Date | null; 
  encodedBy: string = '';
  currentQuarter: number = 1; 

  homePlayers: Player[] = [];
  awayPlayers: Player[] = [];
  allPlayers: Player[] = [];

  substitution: Substitution = {
      playerInId: 0,
      playerOutId: 0,
      quarter: 1,
      gameTime: '00:00',
      matchId: 0,
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
    matchId: 0, 
  };

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres d'URL
    private substitutionService: SubstitutionService,
    private scoreService: ScoreService,
    private matchService: MatchService,
    private timeoutService: TimeoutService,
    private playerService: PlayerService,
    private foulService: FoulService,
    private quarterService: QuarterService,
    private signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.signalrService.startConnection(this.matchId); 

    // Écouter les mises à jour des scores
    this.signalrService.scoreUpdated$.subscribe((data) => {
      if (data && data.matchId === this.matchId) {
        this.homeTeamScore = data.homeTeamScore;
        this.awayTeamScore = data.awayTeamScore;
        this.loadScores(); // Recharger les détails des scores
      }
    });

    // Écouter les créations de temps morts
    this.signalrService.timeoutCreated$.subscribe((data) => {
      if (data && data.matchId === this.matchId) {
        this.loadTimeouts(); // Recharger les temps morts
      }
    });

    this.signalrService.currentQuarterUpdated$.subscribe((quarter) => {
      this.currentQuarter = quarter;
    });

    // Récupérer le matchId depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchId = +id; // Convertir en nombre
      this.foul.matchId = this.matchId; // Assigner à l'objet `foul`
      this.substitution.matchId = this.matchId; // Assigner à l'objet `substitution`
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
      this.numberOfQuarters = match.numberOfQuarters; 
      this.quarterDuration = match.quarterDuration * 60; // Convertir en secondes
      this.timeoutDuration = match.timeoutDuration * 60;
      this.homeTeamId = match.homeTeamId;
      this.awayTeamId = match.awayTeamId;
      this.location = match.location;
      this.matchDate = match.matchDate;
      this.encodedBy = match.encodedBy || 'default@example.com';
      this.currentQuarter = match.currentQuarter ?? 1; 

      this.isMatchFinished = match.isFinished || false;

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
    this.matchService.getMatchScores(this.matchId).subscribe({
      next: (scores) => {
        this.homeTeamScore = scores.homeTeamScore;
        this.awayTeamScore = scores.awayTeamScore;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des scores:', error);
      },
      complete: () => {
      }
    });
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
      quarter: this.currentQuarter,
      gameTime: this.formatTime(this.timer),
      duration: this.formatTime(this.timeoutDuration),
    };

    this.isTimeoutInProgress = true;
    this.stopTimer();

    this.timeoutService.createTimeoutFromMatch(matchId, timeoutData).subscribe({
      next: (response) => {
        this.loadTimeouts();
        setTimeout(() => {
          this.isTimeoutInProgress = false;
          this.startTimer();
        }, this.timeoutDuration * 1000);
      },
      error: (error) => {
        this.isTimeoutInProgress = false;
        this.startTimer();
        console.error('Erreur lors de la création du timeout:', error);
      },
      complete: () => {
      }
    });
  }

  startQuarter(): void {
    if (this.currentQuarter > this.numberOfQuarters) {
      console.warn('Tous les quart-temps sont terminés.');
      return;
    }

    if (this.isQuarterActive) {
      console.warn('Un quart-temps est déjà en cours.');
      return;
    }

    this.timer = 0;
    this.isQuarterActive = true;
    this.isRunning = true;

    // Lancer le timer pour le quart-temps
    this.intervalId = setInterval(() => {
      if (this.timer >= this.quarterDuration) {
        this.endQuarter(); // Fin du quart-temps lorsque la durée est atteinte
      } else {
        this.timer++;
      }
    }, 1000);

    this.signalrService.updateCurrentQuarter(this.matchId, this.currentQuarter);
  }

  endQuarter(): void {
    clearInterval(this.intervalId);
    this.isQuarterActive = false;
    this.isRunning = false;

    const quarterDuration = new Date(this.timer * 1000).toISOString().substr(11, 8); // Convertir le temps en hh:mm:ss

    const quarter: Quarter = {
      id: 0,
      matchId: this.matchId,
      quarterNumber: this.currentQuarter,
      duration: quarterDuration,
    };

    this.quarterService.createQuarter(quarter).subscribe({
      next: (response) => {
        // Incrémenter le currentQuarter après avoir fini le quart-temps
        if (this.currentQuarter < this.numberOfQuarters) {
          this.currentQuarter++;
        } else {
          this.isMatchFinished = true;
          this.matchService.updateMatchStatus(this.matchId, true).subscribe({
            next: () => {
              alert('Fin du match !');
            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour du statut du match:', error);
              alert('Erreur lors de la mise à jour du statut du match.');
            }
          });
        }

        this.matchService.updateCurrentQuarter(this.matchId, this.currentQuarter).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du current quarter:', error);
          }
        });

        this.signalrService.updateCurrentQuarter(this.matchId, this.currentQuarter);
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde du quart-temps:', error);
        alert('Erreur lors de la sauvegarde du quart-temps.');
      }
    });
  }

  recordScore(): void {
    // Recherche du joueur sélectionné
    const selectedPlayer = this.allPlayers.find(
      (player) => Number(player.id) === Number(this.selectedPlayerId)
    );

    // Vérification si le joueur est trouvé
    if (!selectedPlayer || selectedPlayer.id === undefined) {
      console.error('Joueur non trouvé');
      return;
    }

    // Convertir selectedPoints en nombre
    this.selectedPoints = Number(this.selectedPoints);

    // Vérification si les points sont valides
    if (![1, 2, 3].includes(this.selectedPoints)) {
      console.error('Points invalides, uniquement 1, 2 ou 3 sont valides');
      return;
    }

    // Création de l'objet PlayerScore
    const newScore: PlayerScore = {
      playerId: selectedPlayer.id!,  
      points: this.selectedPoints,     
      scoreTime: new Date().toISOString(),  
      matchId: this.matchId,          
    };

    // Appel au service pour ajouter le score
    this.scoreService.addScore(newScore).subscribe({
      next: (response) => {
        this.loadScores(); // Recharger les scores après l'ajout
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement du score:", error);
      },
      complete: () => {
      }
    });

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
        quarter: this.currentQuarter,
        gameTime: this.formatTime(this.timer),  
        foulType: this.foul.foulType,
        id: this.foul.id,
        matchId: this.matchId,
      };

      this.foulService.createFoul(newFoul).subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de la faute:', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Joueur non trouvé ou ID invalide!');
    }
  }

  recordSubstitution(): void {
    const substitutionData: Substitution = {
      playerInId: this.substitution.playerInId,
      playerOutId: this.substitution.playerOutId,
      quarter: this.currentQuarter,
      gameTime: this.formatTime(this.timer),
      matchId: this.matchId,           
    };

    this.substitutionService.recordSubstitution(substitutionData).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement de la substitution:', error);
      },
      complete: () => {
      }
    });
  }
}
