import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { AuthService } from '../services/auth.service'; // adjust path
import { AuthService } from '../../../Services/auth.service'; // adjust path

@Component({
  selector: 'app-send-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.css']
})
export class SendOtpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  otpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    mobilenumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  });

  get f() {
    return this.otpForm.controls;
  }

  sendOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const payload = this.otpForm.value;
    console.log('Sending payload:', payload);

    this.authService.sendOtpLogin(payload).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        if (res.success) {
          alert('OTP sent successfully!');

          // Pass mobilenumber to next route
          this.router.navigate(['validate-otp'], { state: { mobilenumber: payload.mobilenumber } });
        } else {
          alert(res.message || 'Failed to send OTP');
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong, please try again.');
      }
    });
  }
}
