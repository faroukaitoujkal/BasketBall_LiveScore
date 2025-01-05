import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Match } from '../../services/match.model';
import { catchError, of } from 'rxjs';
import { Team } from '../../services/team.model';
import { Player } from '../../services/player.model';
import { rangeValidator } from '../range.validator';
import { uniqueTeamsValidator } from '../unique-teams.validator';
import { User } from '../../services/user.model';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  matchForm: FormGroup;
  teams: Team[] = [];
  users: User[] = [];
  homeTeamPlayers: Player[] = []; 
  awayTeamPlayers: Player[] = []; 

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.matchForm = this.fb.group({
      matchDate: [new Date().toISOString().split('T')[0], Validators.required],
      location: ['', Validators.required],
      homeTeamId: [null, Validators.required],
      awayTeamId: [null, Validators.required],
      numberOfQuarters: [2, [Validators.required, rangeValidator(2, 4)]],
      quarterDuration: [10, [Validators.required, rangeValidator(10, 12)]],
      timeoutDuration: [1, [Validators.required, rangeValidator(1, 3)]],
      homeTeamStartingPlayers: this.fb.array([], [Validators.minLength(5),Validators.maxLength(5)]),
      awayTeamStartingPlayers: this.fb.array([], [Validators.minLength(5),Validators.maxLength(5)]),
      liveEncoders: this.fb.array([], [Validators.minLength(1)])
    }, { validators: uniqueTeamsValidator() });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadUsers();
  }

  get liveEncoders(): FormArray {
    return this.matchForm.get('liveEncoders') as FormArray;
  }

  addLiveEncoder(): void {
    this.liveEncoders.push(this.fb.control('', [Validators.required, Validators.email]));
  }

  removeLiveEncoder(index: number): void {
    this.liveEncoders.removeAt(index);
  }

  get homeTeamStartingPlayers(): FormArray {
    return this.matchForm.get('homeTeamStartingPlayers') as FormArray;
  }

  get awayTeamStartingPlayers(): FormArray {
    return this.matchForm.get('awayTeamStartingPlayers') as FormArray;
  }

  loadTeams(): void {
    this.teamService.getTeams().subscribe(
      (data: Team[]) => {
        this.teams = data;
      },
      error => {
        console.error('Error loading teams', error);
      }
    );
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }

  loadPlayers(teamId: number, isHomeTeam: boolean): void {
    this.playerService.getPlayersByTeam(teamId).subscribe(
      (data: Player[]) => {
        if (isHomeTeam) {
          this.homeTeamPlayers = data;
        } else {
          this.awayTeamPlayers = data;
        }
      },
      error => {
        console.error('Error loading players', error);
      }
    );
  }

  onHomeTeamChange(): void {
    const homeTeamId = this.matchForm.get('homeTeamId')?.value;
    if (homeTeamId) {
      this.loadPlayers(homeTeamId, true);
    }
  }

  onAwayTeamChange(): void {
    const awayTeamId = this.matchForm.get('awayTeamId')?.value;
    if (awayTeamId) {
      this.loadPlayers(awayTeamId, false);
    }
  }

  onPlayerSelectionChange(isHomeTeam: boolean, event: any): void {
    const playerId = event.target.value;

    if (isHomeTeam) {
      if (event.target.checked) {
        // Ajouter un joueur à l'équipe maison
        this.homeTeamStartingPlayers.push(this.fb.control(playerId));
      } else {
        // Retirer un joueur de l'équipe maison
        if (this.homeTeamStartingPlayers.controls) {
          const index = this.homeTeamStartingPlayers.controls.findIndex(control => control.value === playerId);
          if (index !== -1) {
            this.homeTeamStartingPlayers.removeAt(index);
          }
        }
      }
    } else {
      if (event.target.checked) {
        // Ajouter un joueur à l'équipe visiteuse
        this.awayTeamStartingPlayers.push(this.fb.control(playerId));
      } else {
        // Retirer un joueur de l'équipe visiteuse
        if (this.awayTeamStartingPlayers.controls) {
          const index = this.awayTeamStartingPlayers.controls.findIndex(control => control.value === playerId);
          if (index !== -1) {
            this.awayTeamStartingPlayers.removeAt(index);
          }
        }
      }
    }
  }

  isSelected(players: FormArray, playerId: number | undefined): boolean {
    // Vérifier si players est un tableau valide avant d'essayer de l'utiliser
    if (!Array.isArray(players.controls) || playerId === undefined) {
      return false;
    }
    return players.controls.some(control => control.value === playerId);
  }

  onSubmit(): void {
    if (this.matchForm.valid) {
      const homePlayers = this.matchForm.value.homeTeamStartingPlayers;
      const awayPlayers = this.matchForm.value.awayTeamStartingPlayers;

      const match: Match = {
        ...this.matchForm.value,
        matchDate: new Date(this.matchForm.value.matchDate),
        encodedBy: this.authService.currentUserValue?.email,
        homeTeamStartingPlayers: homePlayers,
        awayTeamStartingPlayers: awayPlayers, 
        liveEncoders: this.matchForm.value.liveEncoders,
        quarters: [],
        playerScores: [],
        fouls: [],
        substitutions: [],
        timeouts: [],
        currentQuarter: 1,
        isFinished: false
      };

      console.log('Match payload:', match);

      this.matchService.createMatch(match).pipe(
        catchError(error => {
          console.error('HTTP Error:', error.message);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Match created successfully', response);
          this.matchForm.reset();
          this.router.navigate(['/matches']);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
