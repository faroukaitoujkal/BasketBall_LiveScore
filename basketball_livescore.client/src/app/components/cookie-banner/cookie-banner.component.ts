import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.component.html'
})
export class CookieBannerComponent implements OnInit {
  showBanner = false;

  ngOnInit() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      this.showBanner = true;
    }
  }

  acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    this.showBanner = false;
  }
}
