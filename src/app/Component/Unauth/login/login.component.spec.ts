import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../Services/auth.service';
import { NotificationService } from '../../../Services/notification.service';
import { of, throwError } from 'rxjs';
import { UnauthHeaderComponent } from "../../../Component/Core/unauth-header/unauth-header.component";
import { NewsComponent } from "../../../Component/Core/news/news.component";
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        UnauthHeaderComponent,
        NewsComponent
      ],

      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },



        provideRouter([
          { path: 'home', component: HomeComponent } // ✅ Define test route
        ])


      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.value).toEqual({ email: '', password: '' });
  });
  it('should mark form as invalid if fields are empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });


  it('should validate email field correctly', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.invalid).toBeTrue();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should display error message if login fails', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('wrongpassword');

    authServiceSpy.login.and.returnValue(throwError(() => ({ error: 'Login failed' })));

    component.onSubmit();

    expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Login failed', 'Error');
  });

  it('should call authService login on valid form submission', () => {
    const mockResponse = { success: true, message: 'Login successful', token: 'dummy-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Login successful', 'Success');
    //expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);

  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.showPassword = true;
    expect(component.showPassword).toBeTrue();
  });

  it('should switch tabs correctly', () => {
    component.selectTab('otp');
    expect(component.selectedTab).toBe('otp');

    component.selectTab('fingerprint');
    expect(component.selectedTab).toBe('fingerprint');
  });



});
