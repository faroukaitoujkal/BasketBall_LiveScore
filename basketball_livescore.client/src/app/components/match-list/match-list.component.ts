import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { Match } from '../../services/match.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchesListComponent implements OnInit {
  matches: Match[] = [];
  userEmail: string = ''; // Variable pour stocker l'email de l'utilisateur

  constructor(private matchService: MatchService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadMatches();
    this.userEmail = this.authService.getCurrentUserEmail();
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data: Match[]) => {
        this.matches = data;

        // Load team names for each match
        this.matches.forEach((match) => {
          this.matchService.getTeamName(match.homeTeamId).subscribe((name: string) => {
            match.homeTeam = { id: match.homeTeamId, name } as any;
          });

          this.matchService.getTeamName(match.awayTeamId).subscribe((name: string) => {
            match.awayTeam = { id: match.awayTeamId, name } as any;
          });
        });
      },
      error: (error) => {
        console.error('Error loading matches', error);
      },
      complete: () => {
        console.log('Matches loaded successfully');
      }
    });
  }

  isUserAuthorized(match: Match): boolean {
    // Vérifier si l'email de l'utilisateur est dans la liste des LiveEncoders du match
    return (match.liveEncoders ?? []).includes(this.userEmail);
  }

  viewMatchDetails(matchId: number): void {
    this.router.navigate(['/matches_list', matchId]);
  }

  playMatch(matchId: number): void {
    console.log(`Playing match with ID: ${matchId}`);
    this.router.navigate(['/play-match', matchId]);
  }
}
