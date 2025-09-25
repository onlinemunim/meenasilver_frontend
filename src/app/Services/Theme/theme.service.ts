import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeKey = 'darkMode';

  constructor() {
    this.initTheme(); // Apply saved theme on app start
  }

  initTheme() {
    const isDark = localStorage.getItem(this.darkModeKey) === 'true';
    this.setDarkMode(isDark);
  }

  toggleDarkMode() {
    const newState = !this.isDarkMode();
    this.setDarkMode(newState);
  }

  setDarkMode(enable: boolean) {
    if (enable) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(this.darkModeKey, enable.toString());
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}

