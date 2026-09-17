import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = true;

  constructor() {
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else {
      // Check system preference or default to dark
      this.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private applyTheme() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
