import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { Match } from '../../services/match.model';
import { catchError, of } from 'rxjs';
import { Team } from '../../services/player.model';
import { rangeValidator } from '../range.validator';
import { uniqueTeamsValidator } from '../unique-teams.validator';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  matchForm: FormGroup;
  teams: Team[] = [];

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    private teamService: TeamService,
    private router: Router
  ) {
    this.matchForm = this.fb.group({
      matchDate: ['', Validators.required],
      location: ['', Validators.required],
      homeTeamId: ['', Validators.required],
      awayTeamId: ['', Validators.required],
      numberOfQuarters: [2, [Validators.required, rangeValidator(2, 4)]],
      quarterDuration: [10, [Validators.required, rangeValidator(10, 12)]],
      timeoutDuration: [1, [Validators.required, rangeValidator(1, 3)]]
    }, { validators: uniqueTeamsValidator() });
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
    if (this.matchForm.valid) {
      const match: Match = this.matchForm.value;
      console.log('Submitting match:', JSON.stringify(match, null, 2));

      this.matchService.createMatch(match).pipe(
        catchError(error => {
          console.error('HTTP Error:', error.message);
          console.error('HTTP Response:', error);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Match created successfully', response);
          this.matchForm.reset();
          this.router.navigate(['/matches']);
        } else {
          console.error('Failed to create match. No response received.');
        }
      });
    }
  }
}
