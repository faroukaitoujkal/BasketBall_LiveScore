import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'basketball_livescore.client';

  constructor(
    public authService: AuthService, 
    private router: Router,
    private translate: TranslateService,
    private themeService: ThemeService
  ) { 
    translate.setDefaultLang('fr');
    translate.use('fr');
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.router.navigate(['/matches_list']);
      }
    });
  }
}
