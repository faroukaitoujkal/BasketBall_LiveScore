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
  homeTeamPlayers: Player[] = [];
  awayTeamPlayers: Player[] = [];
  users: User[] = [];

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
      location: ['Stade de France', Validators.required],
      homeTeamId: [null, Validators.required],
      awayTeamId: [null, Validators.required],
      numberOfQuarters: [2, [Validators.required, rangeValidator(2, 4)]],
      quarterDuration: [10, [Validators.required, rangeValidator(10, 12)]],
      timeoutDuration: [1, [Validators.required, rangeValidator(1, 3)]],
      homeTeamStartingPlayers: this.fb.array([], [Validators.minLength(5), Validators.maxLength(5)]),
      awayTeamStartingPlayers: this.fb.array([], [Validators.minLength(5), Validators.maxLength(5)]),
      liveEncoders: this.fb.array([], [Validators.minLength(1)])
    }, { validators: uniqueTeamsValidator() });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadUsers();
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

  onPlayerSelectionChange(isHomeTeam: boolean, selectedOptions: any): void {
    const playerFormArray = isHomeTeam
      ? this.matchForm.get('homeTeamStartingPlayers') as FormArray
      : this.matchForm.get('awayTeamStartingPlayers') as FormArray;

    while (playerFormArray.length) {
      playerFormArray.removeAt(0);
    }

    const selectedPlayerIds = Array.from(selectedOptions).map((option: any) => (option as HTMLOptionElement).value);

    selectedPlayerIds.forEach(playerId => playerFormArray.push(this.fb.control(playerId)));
  }

  onSubmit(): void {
    if (this.matchForm.valid) {
      const homePlayers = this.matchForm.value.homeTeamStartingPlayers;
      const awayPlayers = this.matchForm.value.awayTeamStartingPlayers;

      /*if (homePlayers.length !== 5 || awayPlayers.length !== 5) {
        alert('Each team must have exactly 5 starting players.');
        return;
      }*/

      const match: Match = {
        ...this.matchForm.value,
        matchDate: new Date(this.matchForm.value.matchDate),
        encodedBy: this.authService.currentUserValue?.email,
        homeTeamStartingPlayers: homePlayers.map((playerId: number) => ({ id: playerId })),
        awayTeamStartingPlayers: awayPlayers.map((playerId: number) => ({ id: playerId })),
        liveEncoders: this.matchForm.value.liveEncoders,
        quarters: [],
        playerScores: [],
        fouls: [],
        substitutions: [],
        timeouts: []
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
