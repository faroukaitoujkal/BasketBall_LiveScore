import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../services/match.model';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  match: Match | undefined;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService
  ) { }

  ngOnInit(): void {
    this.loadMatch();
  }

  loadMatch(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')!);
    this.matchService.getMatch(id).subscribe(
      (data: Match) => {
        this.match = data;
      },
      error => {
        console.error('Error loading match', error);
      }
    );
  }
}
