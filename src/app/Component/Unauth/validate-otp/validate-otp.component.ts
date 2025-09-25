import { Component, inject, OnInit, QueryList, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-validate-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.css'],
})
export class ValidateOtpComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  otpForm!: FormGroup;
  mobilenumber!: string;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  ngOnInit() {
    const nav = history.state;
    const passedMobile = nav?.mobilenumber || '';

    this.otpForm = this.fb.group({
      mobilenumber: [passedMobile, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      d1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d6: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  ngAfterViewInit() {
    this.otpInputs.first.nativeElement.focus();
  }

  handleOtpInput(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < this.otpInputs.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    if (!value && event.key === 'Backspace' && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }

    const key = `d${index + 1}`;
    this.otpForm.get(key)?.setValue(value);
  }

  verifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const otp = Object.values(this.otpForm.value)
      .filter((v, i) => i !== 0)
      .join('');

    const payload = {
      mobilenumber: this.otpForm.get('mobilenumber')?.value,
      otp: otp
    };

    this.authService.verifyOtpLogin(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('OTP Verified Successfully!');
          this.router.navigate(['/home']);
        } else {
          alert(res.message || 'Invalid OTP');
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong, please try again.');
      }
    });
  }

  resendOtp() {
    const mobile = this.otpForm.get('mobilenumber')?.value;
    if (!mobile) return;

    this.authService.sendOtpLogin({ mobilenumber: mobile, email: '' }).subscribe({
      next: () => alert('OTP Resent!'),
      error: (err) => console.error(err)
    });
  }

  }


