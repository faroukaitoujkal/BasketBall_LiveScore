import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { CookieBannerComponent } from '../cookie-banner/cookie-banner.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TranslateModule, CookieBannerComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    public translate: TranslateService,
    public themeService: ThemeService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
