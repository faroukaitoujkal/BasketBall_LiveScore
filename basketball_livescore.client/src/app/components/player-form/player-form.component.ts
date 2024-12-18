import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Player } from '../../services/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {
  playerForm: FormGroup;

  constructor(private fb: FormBuilder, private playerService: PlayerService) {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      teamId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      const player: Player = this.playerForm.value;
      this.playerService.createPlayer(player).subscribe(
        response => {
          console.log('Player created successfully', response);
          this.playerForm.reset();
        },
        error => {
          console.error('Error creating player', error);
        }
      );
    }
  }
}
