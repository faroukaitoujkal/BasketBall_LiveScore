import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../services/team.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css'],
})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private teamService: TeamService, private router: Router) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const team: Team = this.teamForm.value;
      console.log('Submitting team:', JSON.stringify(team, null, 2)); 

      this.teamService.createTeam(team).pipe(
        catchError(error => {
          console.error('HTTP Error:', error.message);
          console.error('HTTP Response:', error);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Team created successfully', response);
          this.teamForm.reset();
          this.router.navigate(['/teams']);
        } else {
          console.error('Failed to create team. No response received.');
        }
      });
    }
  }
}
