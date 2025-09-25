import { AuthService } from './../../../Services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Params } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UnauthHeaderComponent } from "../../../Component/Core/unauth-header/unauth-header.component";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../Services/notification.service';
import { GstService } from '../../../gst.service';
import { UserServiceService } from '../../../Services/user.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  imports: [RouterLink, UnauthHeaderComponent, MatCheckboxModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm!: FormGroup;
  countries: any;
  states: any;
  cities: any;
  generatedCaptcha: string = '';
  isGstLoading: boolean = false;
  isCaptchaLoading: boolean = false;
  userCaptcha: string = '';
  router = inject(Router);

  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public notificationService: NotificationService,
    public gstService: GstService,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
    this.fetchCountries();
    this.intiSignupForm();
    this.generateCaptcha();
  }

  fetchCountries() {
    const params = new HttpParams();

    this.userService.getCountries(params).subscribe((response: any) => {
      this.countries = response.data;
    }, (error) => {
      console.error('Error fetching countries:', error);
      this.notificationService.showError('Failed to fetch countries. Please try again.', 'Error');
    });
  }

  fetchStates(countryId: number, callbackFunction: any = null) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.userService.getStates(params).subscribe((response: any) => {
      this.states = response.data;
      this.cities = [];

      this.signUpForm.controls['state'].setValue('');
      this.signUpForm.controls['city'].setValue('');

      if (callbackFunction) {
        callbackFunction();
      }
    }, (error) => {
      this.notificationService.showError('Failed to fetch states. Please try again.', 'Error');
    });
  }

  get userServiceForTest() {
    return this.userService;
  }

  onCountryChange() {
    const countryId = this.signUpForm.controls['country'].value;
    if (countryId) {
      this.fetchStates(countryId);
    }
  }

  onStateChange() {
    const stateId = this.signUpForm.controls['state'].value;
    if (stateId) {
      this.fetchCities(stateId);
    }
  }

  fetchCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.userService.getCities(params).subscribe((response: any) => {
      this.cities = response.data;

      if (this.cities && this.cities.length > 0) {
        const selectedCity = this.cities.find((city: any) => city.name === this.signUpForm.controls['city'].value);
        if (selectedCity) {
          this.signUpForm.controls['city'].setValue(selectedCity.id);  // Using city.id for consistency
        } else {
          this.signUpForm.controls['city'].setValue(this.cities[0].id);  // Set default city
        }
      }
    }, (error) => {
      console.error('Error fetching cities:', error);
      this.notificationService.showError('Failed to fetch cities. Please try again.', 'Error');
    });
  }

  intiSignupForm() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80), Validators.pattern(/^[A-Za-z\s]+$/)]],
      mobilenumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      jewelleryappcode: ['', [Validators.required]],
      billingname: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{3,50}$/)]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      gstnumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/)]],
      staffcode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$')]],
      Captcha: ['', [Validators.required]],
      softwarepackages: ['', [Validators.required]],
      smsconsent: [1, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      user_loginid: ['', [Validators.required]],
    });
  }

  onSmsConsentChange(event: any): void {
    const isChecked = event.checked;
    this.signUpForm.controls['smsconsent'].setValue(isChecked ? 1 : 0);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  patchData() {
    const gstnumber = this.signUpForm.controls['gstnumber'].value?.trim();

    if (!gstnumber) {
      this.notificationService.showError('Please enter a valid GST number', 'Error');
      return;
    }

    this.isGstLoading = true;  // Set GST loading state

    this.gstService.getGstDetails(gstnumber).subscribe(
      (response: any) => {
        console.log('API Response:', response);

        if (response.success) {
          this.fetchStates(response.data.country, () => {
            this.patchFormData(response);
          });

          this.notificationService.showSuccess('Data successfully fetched and form updated', 'Success');
        } else {
          this.notificationService.showError('Information not found for this GST number', 'Error');
        }

        this.isGstLoading = false;  // Reset GST loading state
      },
      (error) => {
        this.isGstLoading = false;  // Reset GST loading state on error
        console.error('Error fetching GST details:', error);
        this.notificationService.showError('Failed to fetch GST details. Please try again.', 'Error');
      }
    );
  }


  patchFormData(response: any) {
    if (response && response.data) {
      const gstData = response.data;

      this.signUpForm.patchValue({
        gstnumber: gstData.gstnumber || '',
        name: gstData.name || '',
        mobilenumber: gstData.mobilenumber || '',
        email: gstData.email || '',
        address: gstData.address || '',
        city: gstData.city || null,
        state: gstData.state || null,
        country: gstData.country || '',
        pincode: gstData.pincode || '',
        billingname: gstData.billingname || ''
      });

      if (gstData.state) {
        console.log('Fetching cities for state:', gstData.state);
        this.fetchCities(gstData.state);
      }
    } else {
      console.error('Invalid response data:', response);
      this.notificationService.showError('Error fetching data', 'Error');
    }
  }

  onSubmit() {

    console.log('Is the form valid?', this.signUpForm.valid);

    if (this.signUpForm.invalid) {
      console.log('--- FORM IS INVALID. CHECKING CONTROLS: ---');
      Object.keys(this.signUpForm.controls).forEach(key => {
        const control = this.signUpForm.get(key);
        if (control && control.invalid) {
          console.log(`%c[INVALID] Control Name: ${key}`, 'color: red; font-weight: bold;');
          console.log('--- Error Object:', control.errors);
          console.log('--- Current Value:', `"${control.value}"`);
        }
      });
    }


    if (this.signUpForm.invalid) {
      return;
    }

    if (this.userCaptcha != this.generatedCaptcha) {
      this.notificationService.showError('CAPTCHA does not match!', 'Error');
      return;
    }
    
    const payload = {
      ...this.signUpForm.value,
      state_id: this.signUpForm.value.state,
      country_id: this.signUpForm.value.country,
      city_id: this.signUpForm.value.city,
    };

    this.authService.signup(payload).subscribe({
      next: (data) => {
        if (data.success) {
          this.notificationService.showSuccess('Signup Successful...', 'Success');
          this.router.navigate(['/login']);
        } else {
          this.notificationService.showError(data.message, 'Error');
        }
      },
      error: (err) => {
        this.notificationService.showError('Signup failed due to an error', 'Error');
      }
    });
  }


  loginPage() {
    this.router.navigate(['login']);
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
