import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { TimeoutService, TimeoutMatch } from '../../services/timeout.service';
import { Match } from '../../services/match.model';
import { Player } from '../../services/player.model'; // Assurez-vous que Player est bien défini
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-play-match',
  templateUrl: './play-match.component.html',
  styleUrls: ['./play-match.component.css'],
})
export class PlayMatchComponent implements OnInit {
  timer: number = 0;
  intervalId: any = null;
  isRunning: boolean = false;
  isTimeoutInProgress: boolean = false; // Ajout d'un indicateur pour le timeout

  matchId: number = 1; // ID du match (peut être dynamique)
  quarter: number = 1;
  timeoutDuration: number = 60; // En secondes par défaut
  timeouts: TimeoutMatch[] = [];
  homeTeamId: number = 0;
  awayTeamId: number = 0;
  location: string = '';
  encodedBy: string = '';

  homePlayers: Player[] = [];  // Liste des joueurs de l'équipe à domicile
  awayPlayers: Player[] = [];  // Liste des joueurs de l'équipe extérieure

  constructor(
    private matchService: MatchService,
    private timeoutService: TimeoutService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.loadMatchDetails();
    this.loadTimeouts();
  }

  startTimer(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if (!this.isTimeoutInProgress) {
          this.timer++; // Incrémente le timer seulement si le timeout n'est pas en cours
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
      this.timeoutDuration = match.timeoutDuration * 60; // Convertir en secondes
      this.homeTeamId = match.homeTeamId;
      this.awayTeamId = match.awayTeamId;
      this.location = match.location;
      this.encodedBy = match.encodedBy || 'default@example.com'; // Provide a default value
      this.loadPlayers();  // Recharger les joueurs lorsque les détails du match sont chargés
    });
  }

  loadTimeouts(): void {
    this.timeoutService.getTimeoutsByMatch(this.matchId).subscribe((timeouts: TimeoutMatch[]) => {
      this.timeouts = timeouts;
    });
  }

  loadPlayers(): void {
    this.playerService.getPlayersByTeam(this.homeTeamId).subscribe((players: Player[]) => {
      console.log('Players for home team:', players);  // Vérifiez si les joueurs sont renvoyés
      this.homePlayers = players.slice(0, 5);  // Prendre les 5 premiers joueurs
    });

    this.playerService.getPlayersByTeam(this.awayTeamId).subscribe((players: Player[]) => {
      console.log('Players for away team:', players);  // Vérifiez si les joueurs sont renvoyés
      this.awayPlayers = players.slice(0, 5);  // Prendre les 5 premiers joueurs
    });
  }

  // Création d'un timeout avec gestion du timer
  createTimeoutForMatch(matchId: number): void {
    const timeoutData = {
      Match: {
        HomeTeamId: this.homeTeamId,
        AwayTeamId: this.awayTeamId,
        TimeoutDuration: this.timeoutDuration / 60, // Convertir en minutes si nécessaire
        Location: this.location,
        EncodedBy: this.encodedBy
      },
      quarter: this.quarter,
      gameTime: this.formatTime(this.timer), // Calculer la durée en format hh:mm:ss
      duration: this.formatTime(this.timeoutDuration) // Durée du timeout en format hh:mm:ss
    };

    // Démarrer un timeout et mettre le timer en pause
    this.isTimeoutInProgress = true; // Indique que le timeout est en cours
    this.stopTimer(); // Arrêter le timer

    this.timeoutService.createTimeoutFromMatch(matchId, timeoutData).subscribe(
      (response) => {
        console.log('Timeout créé avec succès:', response);
        this.loadTimeouts(); // Recharge les timeouts après création

        // Après la durée du timeout, relancer le timer
        setTimeout(() => {
          this.isTimeoutInProgress = false; // Timeout terminé
          this.startTimer(); // Relancer le timer
        }, this.timeoutDuration * 1000); // Multiplie par 1000 pour avoir la durée en millisecondes
      },
      (error) => {
        console.error('Erreur lors de la création du timeout:', error);
        this.isTimeoutInProgress = false; // Réinitialiser si erreur
        this.startTimer(); // Reprendre le timer même en cas d'erreur
      }
    );
  }
}
