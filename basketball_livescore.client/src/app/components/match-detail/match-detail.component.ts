import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { FoulService } from '../../services/foul.service';
import { Match } from '../../services/match.model';
import { Foul } from '../../services/foul.model';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  match: Match | undefined;
  fouls: Foul[] = []; // Liste des fautes du match

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private foulService: FoulService
  ) { }

  ngOnInit(): void {
    this.loadMatch();
    this.loadFouls();
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

  loadFouls(): void {
    const matchId = Number(this.route.snapshot.paramMap.get('id')!);
    this.foulService.getFoulsByMatch(matchId).subscribe(
      (data: Foul[]) => {
        this.fouls = data;
      },
      error => {
        console.error('Error loading fouls', error);
      }
    );
  }
}
