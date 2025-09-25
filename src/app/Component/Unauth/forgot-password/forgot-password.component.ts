import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordService } from '../../../Services/Password/forget-password.service';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  router = inject(Router);
  formBuilder = inject(FormBuilder);
  forgotPasswordForm!: FormGroup;

  constructor(private forgotPasswordService: ForgetPasswordService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.initForgotPasswordForm();
  }

  initForgotPasswordForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [''],
    });
  }

  toggleForgotPassword() {
  throw new Error('Method not implemented.');
  }

  verifyOTP() {
    const email = this.forgotPasswordForm.get('email')?.value;

    this.forgotPasswordService.forgotPassword({ email }).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('OTP sent successfully!', 'Success');
        localStorage.setItem('reset_email', email);
        this.router.navigate(['verify-otp'], { state: { email } });
      },
      error: (err) => {
        this.notificationService.showError(
          err?.error?.message || 'Failed to send OTP. Please try again.',
          'Error'
        );
      }
    });
  }
}
