import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { Match } from '../../services/match.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchesListComponent implements OnInit {
  matches: Match[] = [];

  constructor(private matchService: MatchService, private router: Router) { }

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe(
      (data: Match[]) => {
        this.matches = data;
      },
      error => {
        console.error('Error loading matches', error);
      }
    );
  }

  viewMatchDetails(matchId: number): void {
    this.router.navigate(['/matches_list', matchId]);
  }

  playMatch(matchId: number): void {
    console.log(`Playing match with ID: ${matchId}`);
  }
}
