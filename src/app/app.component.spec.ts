import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './Services/auth.service';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './Component/Core/navbar/navbar.component';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], { isAuthenticated: true });

    await TestBed.configureTestingModule({
      imports: [AppComponent, NavbarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have title as environment.appName`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual(environment.appName);
  });

  it('should check if user is logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isLoggedIn).toBeTrue();
  });
});
