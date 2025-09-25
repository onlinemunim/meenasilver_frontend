import { CustomSelectComponent } from './../../Core/custom-select/custom-select.component';
import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { NotificationService } from '../../../Services/notification.service';
import { initFlowbite } from 'flowbite';
import { SendOtpComponent } from "../send-otp/send-otp.component";
import { NgIf } from '@angular/common';
import { NavbarService } from '../../../Services/navbar.service';

@Component({
  selector: 'app-login',
  imports: [CustomSelectComponent,RouterLink, ReactiveFormsModule, SendOtpComponent,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  selectedTab = 'login';
  generatedCaptcha: string = '';
  isGstLoading: boolean = false;
  isCaptchaLoading: boolean = false;
  userCaptcha: string = '';
  UserType: string[] =[
    'Staff',
    'Owner'
    ];
    selectedUser: string = '';

  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private navbarService: NavbarService
  ) { }

  ngOnInit(): void {
    this.generateCaptcha();
    this.inItForm();
    initFlowbite()
  }

  inItForm() {
    this.loginForm = this.fb.group({
      owner_email:[''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],//Validators.minLength(6),
      Captcha: [this.generatedCaptcha, [Validators.required]],
      user_type: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const enteredCaptcha = this.loginForm.get('Captcha')?.value;

    if (enteredCaptcha !== this.generatedCaptcha) {
      this.notificationService.showError('Invalid Captcha. Please try again.', 'Error');
      this.generateCaptcha(); // regenerate captcha
      this.loginForm.get('Captcha')?.reset(); // clear input
      return;
    }

    let payload = { ...this.loginForm.value };

    if (payload.user_type === 'Owner') {
      delete payload.owner_email;
    } else if (payload.user_type === 'Staff') {
      if (!payload.owner_email) {
        this.notificationService.showError('Owner email is required for staff login', 'Error');
        return;
      }
    }

    this.authService.login(payload).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.errorMessage = '';
          this.notificationService.showSuccess(response.message, 'Success');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_type', response.user_type);
          this.navbarService.updateSettingsVisibility();
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your credentials and try again';
        this.notificationService.showError('Login failed', 'Error');
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  homePage(){
    this.router.navigate(['/home']);
  }
  refreshCaptcha() {
    this.isCaptchaLoading = true;

    setTimeout(() => {
      this.generateCaptcha();
      this.isCaptchaLoading = false;
    }, 1000);
  }

  generateCaptcha() {
    const captchaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.generatedCaptcha = '';
    for (let i = 0; i < 6; i++) {
      this.generatedCaptcha += captchaChars.charAt(Math.floor(Math.random() * captchaChars.length));
    }
  }
}
