import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterTestingModule } from '@angular/router/testing';
import { inject } from '@angular/core';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ForgotPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call verifyOTP and navigate to verify-otp', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.verifyOTP();
    expect(navigateSpy).toHaveBeenCalledWith(['verify-otp']);
  });

  it('should throw an error when toggleForgotPassword is called', () => {
    expect(() => component.toggleForgotPassword()).toThrowError('Method not implemented.');
  });
});
