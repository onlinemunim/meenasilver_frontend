import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { NgIf } from '@angular/common';
import { environment } from '../environments/environment';
import { UnauthenticatedLayoutComponent } from './Component/Unauth/unauthenticated-layout/unauthenticated-layout.component';
import { Router } from '@angular/router';
import { SignupComponent } from './Component/Unauth/signup/signup.component';
import { HomeComponent } from './Component/home/home.component';
import { AuthenticatedLayoutComponent } from './Component/Auth/authenticated-layout/authenticated-layout.component';
import { NavbarService } from './Services/navbar.service';
import { CustomizeService } from './Services/Customize_settings/customize.service';
import { FirmSelectionService } from './Services/firm-selection.service';
import { SimpleUnauthComponent } from './Component/Unauth/simple-unauth/simple-unauth.component';
import { AdminSettingsService } from './Services/Admin_Settings/admin-settings.service';

@Component({
  selector: 'app-root',
  imports: [
    NgIf,
    UnauthenticatedLayoutComponent,
    SignupComponent,
    HomeComponent,
    AuthenticatedLayoutComponent,
    SimpleUnauthComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  title: string = environment.appName;

  loginState!: string;

  signupState!: string;

  homeState!: string;

  mainlogin: boolean = false;
  simplelogin: boolean = false;
  loginTypeLoaded: boolean = false;

  constructor(
    private authService: AuthService,
    public router: Router,
    private navbarService: NavbarService,
    private customizeService: CustomizeService,
    private firmSelectionService: FirmSelectionService,
    private adminSettingsService: AdminSettingsService
  ) {}

  ngOnInit(): void {
    this.getLoginType();
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm?.id) {
        this.loadNavbarSettingsForFirm(firm.id);
      }
    });
  }

  getLoginType(){
    this.adminSettingsService.getAdminSettings().subscribe({
      next: (response) => {
        const settings = response.data[0];
        if (settings) {
          this.mainlogin = settings.login_type !== 'simple';
          this.simplelogin = settings.login_type === 'simple';
        } else {
          this.mainlogin = true;
          this.simplelogin = false;
        }
        this.loginTypeLoaded = true;
      },
      error: (err) => {
        console.error('Failed to load admin settings on app init:', err);
        this.mainlogin = true;
        this.simplelogin = false;
        this.loginTypeLoaded = true;
      }
    });
  }

  loadNavbarSettingsForFirm(firmId: number): void {
    this.customizeService.getUserSettings(firmId).subscribe({
      next: (response) => {
        const settings = response.data;
        if (settings) {
          const submenuVisibility = settings.submenu_visibility || {};
          const mainMenuVisibility = settings.mainmenu_visibility || {};
          this.navbarService.setAllVisibilities(submenuVisibility);
          this.navbarService.setMainMenuVisibilities?.(mainMenuVisibility);
        }
      },
      error: (err) => {
        console.error('Failed to load navbar settings on app init:', err);
      }
    });
  }

  get isUnauthPage(): boolean {
    const unauthRoutes = [
      '/login',
      '/forgot-password',
      '/verify-otp',
      '/update-password',
      '/validate-otp',
    ];
    return unauthRoutes.includes(this.router.url);
  }

  get isSignupPage(): boolean {
    return this.router.url === '/signup';
  }

  get isHomePage(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }

  get isLoggedIn() {
    return this.authService.isAuthenticated;
  }

  get isAuthPage(): boolean {
    return !this.isUnauthPage && !this.isSignupPage && !this.isHomePage;
  }

}



