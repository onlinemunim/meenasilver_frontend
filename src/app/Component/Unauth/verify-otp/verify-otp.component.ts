import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordService } from '../../../Services/Password/forget-password.service';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit {
  router = inject(Router);
  forgotPasswordForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  otpVerified: boolean = false;
  emailFromState: string = '';

  constructor(private forgotPasswordService: ForgetPasswordService,private notificationService: NotificationService) { }

  ngOnInit(): void {
     const nav = this.router.getCurrentNavigation();
     const state = nav?.extras?.state as { email: string };
     this.emailFromState = state?.email || localStorage.getItem('reset_email') || '';

     this.initVerifyOtpForm();
  }

  initVerifyOtpForm(){
    this.forgotPasswordForm = this.formBuilder.group({
      email: [this.emailFromState],
      d1: [''],
      d2: [''],
      d3: [''],
      d4: [''],
      d5: [''],
      d6: [''],
      otp: ['123456'],
      password: [''],
      password_confirmation: ['']
    });
  }

  updatePassword(){
    this.router.navigate(['update-password']);
  }

  loginPage(){
    this.router.navigate(['login']);
  }

  verifyOtp() {
     const otp =
     this.forgotPasswordForm.value.d1 +
     this.forgotPasswordForm.value.d2 +
     this.forgotPasswordForm.value.d3 +
     this.forgotPasswordForm.value.d4 +
     this.forgotPasswordForm.value.d5 +
     this.forgotPasswordForm.value.d6;

    const payload = {
      email: this.forgotPasswordForm.value.email,
      otp: otp,
      password: this.forgotPasswordForm.value.password,
      password_confirmation: this.forgotPasswordForm.value.password_confirmation
    };

    this.forgotPasswordService.resetPassword(payload).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('OTP verified successfully!', 'Success');
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.notificationService.showError(
          err?.error?.message || 'Invalid OTP. Please try again.',
          'Error'
        );
      }
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    const target = keyboardEvent.target as HTMLElement;
    const form = target.closest('form');
    if (!form) return;

    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>('input, select, textarea, button')
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    const index = focusable.indexOf(target);
    if (index > -1 && index + 1 < focusable.length) {
      focusable[index + 1].focus();
    }
  }
}
