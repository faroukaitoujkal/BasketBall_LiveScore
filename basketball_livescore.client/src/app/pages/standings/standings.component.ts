import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingService } from '../../services/standing.service';
import { Standing } from '../../services/standing.model';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings.component.html'
})
export class StandingsComponent implements OnInit {
  standings: Standing[] = [];

  constructor(private standingService: StandingService) {}

  ngOnInit(): void {
    this.standingService.getStandings().subscribe((data: any) => {
      this.standings = data;
    });
  }
}
