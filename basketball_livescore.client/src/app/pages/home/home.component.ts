import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../services/match.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  liveMatches: Match[] = [];
  otherMatches: Match[] = [];
  MatchStatus = MatchStatus;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches() {
    this.matchService.getMatches().subscribe(matches => {
      this.liveMatches = matches.filter(m => m.status === MatchStatus.InProgress);
      this.otherMatches = matches.filter(m => m.status !== MatchStatus.InProgress);
    });
  }
}
