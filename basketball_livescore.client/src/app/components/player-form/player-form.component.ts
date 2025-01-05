import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { Player, Team } from '../../services/player.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css'],
})
export class PlayerFormComponent implements OnInit {
  playerForm: FormGroup;
  teams: Team[] = [];

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router
  ) {
    this.playerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      number: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      teamId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeams();
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

  onSubmit(): void {
    if (this.playerForm.valid) {
      const player: Player = {
        ...this.playerForm.value,
        team: undefined
      };

      this.playerService.createPlayer(player).pipe(
        catchError(error => {
          console.error('HTTP Error:', error.message);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Player created successfully', response);
          this.playerForm.reset();
          this.router.navigate(['/players']);
        }
      });
    }
  }
}
