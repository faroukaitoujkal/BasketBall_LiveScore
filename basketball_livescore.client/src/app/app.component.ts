import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'basketball_livescore.client';

  constructor(public authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.router.navigate(['/matches_list']);
      }
    });
  }
}
