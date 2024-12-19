import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../services/team.model';

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
      this.teamService.createTeam(team).subscribe(
        response => {
          console.log('Team created successfully', response);
          this.teamForm.reset();
          this.router.navigate(['/teams']);
        },
        error => {
          console.error('Error creating team', error);
        }
      );
    }
  }

  navigateToPlayer(): void {
    this.router.navigateByUrl("/players/create");
  }
}
