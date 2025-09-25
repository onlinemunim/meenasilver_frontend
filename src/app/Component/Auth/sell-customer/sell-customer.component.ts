import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from '../../Core/custom-select/custom-select.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FirmService } from '../../../Services/firm.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserCustomerService } from '../../../Services/User/Customer/user-customer.service';
import { NotificationService } from '../../../Services/notification.service';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Country } from '../../../Models/country';
import { UserServiceService } from '../../../Services/user.service';
import { Cities } from '../../../Models/Cities';
import { States } from '../../../Models/States';

@Component({
  selector: 'app-sell-customer',
  imports: [CustomSelectComponent,NgFor,ReactiveFormsModule,NgIf],
  templateUrl: './sell-customer.component.html',
  styleUrl: './sell-customer.component.css'
})
export class SellCustomerComponent implements OnInit {

  prodCategory: string[] = ['Mr.', 'Mrs.', 'Ms.', 'M/S.'];
  customerTypes: string[] = ['Wholesale', 'Retailer', 'Direct Customer', 'Family', 'Friend'];
  selectedCustomer: string = '';
  selectedProdCategory: string = '';
  firmTypes: { id: number; name: string }[] = [];
  selectedFirmType: string = '';
  sellCustomerForm!:FormGroup;
  customerData:any;
  searchText: string = '';
  showDropdown = false;
  filteredCustomers: any[] = [];
  customerId: any;
  activeIndex = -1;
  nameSearch: string = '';
  mobileSearch: string = '';
  countries: Country[] = [];
  cities: Cities[] = [];
  states: States[] = [];
  generatedOtp: string | null = null;
  message: string = '';
  //remove the below variables if not needed
  isOtpSent = false;
  isOtpVerified = false;

  constructor(private firmService: FirmService,private fb:FormBuilder,
    private userCustomerService:UserCustomerService,
    private notificationService:NotificationService,
    private router:Router,private userService:UserServiceService) {}

  ngOnInit() {
    this.loadFirmList();
    this.initForm();
    this.getCustomerData();
    this.fetchCountries();
    this.filteredCustomers = [];
  }
  fetchCountries() {
    const params = new HttpParams();

    this.userService.getCountries(params).subscribe(
      (response: any) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
        this.notificationService.showError(
          'Failed to fetch countries. Please try again.',
          'Error'
        );
      }
    );
  }

  initForm() {
    const firmId = localStorage.getItem('firm_id');

    this.sellCustomerForm = this.fb.group({
      user_title: [''],
      name: [''],
      user_last_name: [''],
      mobilenumber: [''],
      user_secondary_mobile_no: [''],
      user_aadhar_card_no: [''],
      user_pan_card_no: [''],
      user_firm_id: [firmId ? firmId : '', Validators.required],
      user_customer_type:[''],
      user_middle_name: [''],
      country_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      gstnumber:[''],
      email: ['', [Validators.email]],
      pincode:[''],
      address: ['', [Validators.required]],
      otp: [''],

    })
  }

  onSubmit() {
      this.userCustomerService.createUserCustomer(this.sellCustomerForm.value).subscribe({
        next: (res: any) => {
          this.customerId = res.data.id;
          this.notificationService.showSuccess('Customer created successfully!', 'Success');
          this.router.navigate([
            `/sell-details/customer/${res.data.id}/sell-details`
          ]);
        },
        error: (err: any) => {
          this.notificationService.showError('Error creating customer', 'Error');
          console.error('Error creating customer:', err);
        }
      });
  }

  getCustomerData() {
    const params = new HttpParams();
    this.userCustomerService.getUserCustomers(params).subscribe((response: any) => {
      this.customerData = response.data;
    });
  }

  filterCustomers() {
    const name = this.nameSearch.trim().toLowerCase();
    const mobile = this.mobileSearch.trim();

    if (name || mobile) {
      this.filteredCustomers = this.customerData.filter((cust: any) => {
        const nameMatch = name ? cust.name?.toLowerCase().startsWith(name) : true;
        const mobileMatch = mobile ? cust.mobilenumber?.toString().startsWith(mobile) : true;

        // both must match if both have values
        return nameMatch && mobileMatch;
      }).slice(0, 5);
    } else {
      this.filteredCustomers = [];
    }
  }

  filterCustomersByName(event?: Event) {
    this.nameSearch = (event?.target as HTMLInputElement)?.value || '';
    this.filterCustomers();
  }

  filterCustomersByMobile(event?: Event) {
    this.mobileSearch = (event?.target as HTMLInputElement)?.value || '';
    this.filterCustomers();
  }

  selectCustomer(customer: any) {
    this.searchText = `${customer.name} ${customer.user_last_name || ''}`;
    this.showDropdown = false;
    this.onCustomerSelected(customer);
  }

  onCustomerSelected(customer: any) {
    this.customerId = customer.id;
    if (this.customerId && (customer.user_customer_type === 'Retailer' || customer.user_customer_type === 'Wholesale')) {
      this.router.navigate([
        `/sell-details-lot/${this.customerId}`
      ]);
    }else{
      this.router.navigate([
        `/sell-details/customer/${this.customerId}/sell-details`
      ]);
    }
  }

  fetchStates(countryId: number, callbackFunction: any = null) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.userService.getStates(params).subscribe(
      (response: any) => {
        this.states = response.data;
        this.cities = [];

        this.sellCustomerForm.controls['state_id'].setValue('');
        this.sellCustomerForm.controls['city_id'].setValue('');

        if (callbackFunction) {
          callbackFunction();
        }
      },
      (error) => {
        this.notificationService.showError(
          'Failed to fetch states. Please try again.',
          'Error'
        );
      }
    );
  }

  onCountryChange() {
    const countryId = this.sellCustomerForm.controls['country_id'].value;
    if (countryId) {
      this.fetchStates(countryId);
      const selectedCountry = this.countries.find((c) => c.id === +countryId);
      if (selectedCountry) {
        this.sellCustomerForm.patchValue({
          currency_code: selectedCountry.currency,
        });
      }
    }
  }

  onStateChange() {
    const stateId = this.sellCustomerForm.controls['state_id'].value;
    if (stateId) {
      this.fetchCities(stateId);
    }
  }
  fetchCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.userService.getCities(params).subscribe(
      (response: any) => {
        this.cities = response.data;

        if (this.cities && this.cities.length > 0) {
          const selectedCity = this.cities.find(
            (city: any) => city.name === this.sellCustomerForm.controls['city_id'].value
          );
          if (selectedCity) {
            this.sellCustomerForm.controls['city_id'].setValue(selectedCity.id);
          } else {
            this.sellCustomerForm.controls['city_id'].setValue(this.cities[0].id);
          }
        }
      },
      (error) => {
        console.error('Error fetching cities:', error);
        this.notificationService.showError(
          'Failed to fetch cities. Please try again.',
          'Error'
        );
      }
    );
  }

  sendOtp() {
    const mobile = this.sellCustomerForm.get('mobilenumber')?.value?.trim();

    if (!mobile) {
      this.notificationService.showError('Please enter mobile number first!','Validation Error');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      this.notificationService.showError('Please enter a valid 10-digit mobile number!','Validation Error');
      return;
    }

    this.userService.sendOtp(mobile).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.showSuccess(`✅ OTP sent successfully to ${mobile}`,'Success');
          this.isOtpSent = true;
        } else {
          this.notificationService.showError('❌ Failed to send OTP!','validation erro');
        }
      },
      error: () => {
        this.notificationService.showError('❌ Error while sending OTP!','Validation Error');
      }
    });
  }

  verifyOtp() {
    const enteredOtp = this.sellCustomerForm.get('otp')?.value?.trim();

    if (!enteredOtp) {
      this.notificationService.showError('Please enter the OTP!','Success');
      return;
    }

    this.userService.verifyOtp(enteredOtp).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.showSuccess('✅ OTP Verified Successfully!','Success');
        } else {
          this.notificationService.showError(`❌ ${res.message}`,'Validation error');
        }
      },
      error: () => {
        this.notificationService.showError('❌ Error verifying OTP!','Validation Error ');
      }
    });
  }



  // verifyOtp() {
  //   const enteredOtp = this.sellCustomerForm.get('otp')?.value?.trim();

  //   if (!enteredOtp) {
  //     this.message = 'Please enter the OTP!';
  //     return;
  //   }

  //   this.userService.verifyOtp(enteredOtp).subscribe({
  //     next: (res) => {
  //       if (res.success) {
  //         this.message = '✅ OTP Verified Successfully!';
  //       } else {
  //         this.message = `❌ ${res.message}`;
  //       }
  //     },
  //     error: () => {
  //       this.message = '❌ Error verifying OTP!';
  //     }
  //   });
  // }

  loadFirmList() {
    this.firmService.getFirms().subscribe((res: any) => {
      this.firmTypes = res.data;
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
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
}
