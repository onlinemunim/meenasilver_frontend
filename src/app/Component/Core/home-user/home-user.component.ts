import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirmService } from '../../../Services/firm.service';
import { NgFor, NgIf } from '@angular/common';
import { Country } from '../../../Models/country';
import { HttpParams } from '@angular/common/http';
import { UserServiceService } from '../../../Services/user.service';
import { NotificationService } from '../../../Services/notification.service';
import { Router } from '@angular/router';
import { UserCustomerService } from '../../../Services/User/Customer/user-customer.service';

@Component({
  selector: 'app-home-user',
  imports: [ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit {
  userForm!: FormGroup;
  firmTypes: any[] = [];
  countries: Country[] = [];
  states: any[] = [];
  cities: any[] = [];
  nameSearch: string = '';
  mobileSearch: string = '';
  filteredCustomers: any[] = [];
  customerData: any;
  searchText: string = '';
  showDropdown = false;
  customerId: any;
  customerTypes: string[] = ['Wholesale', 'Retailer', 'Direct Customer', 'Family', 'Friend'];
  previewImages: { name: string, url: string }[] = [];
  hoveredImage: { name: string, url: string } | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private firmService: FirmService,
    private userService: UserServiceService,
    private notificationService: NotificationService,
    private userCustomerService:UserCustomerService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFirmList();
    this.fetchCountries();
    this.getCustomerData();
  }

  initForm() {
    const firmId = localStorage.getItem('firm_id');

    this.userForm = this.fb.group({
      user_title: [''],
      name: [''],
      user_last_name: [''],
      mobilenumber: [''],
      user_secondary_mobile_no: [''],
      user_aadhar_card_no: [''],
      user_pan_card_no: [''],
      doc_user_img: [''],
      user_firm_id: [firmId ? firmId : ''],
      user_customer_type: [''],
      user_middle_name: [''],
      country_id: [''],
      city_id: [''],
      state_id: [''],
      gstnumber:[''],
      user_gender: [''],
      email: [''],
      pincode:[''],
      address: [''],
      otp: [''],

    })
  }

  loadFirmList() {
    this.firmService.getFirms().subscribe((res: any) => {
      this.firmTypes = res.data;
    });
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

  fetchStates(countryId: number, callbackFunction: any = null) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.userService.getStates(params).subscribe(
      (response: any) => {
        this.states = response.data;
        this.cities = []; // Clear cities when new states are loaded
        this.userForm.controls['state_id'].setValue(''); // Clear state selection when new states arrive
        this.userForm.controls['city_id'].setValue(''); // Clear city selection

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
    const countryId = this.userForm.controls['country_id'].value;
    if (countryId) {
      this.fetchStates(countryId);
      const selectedCountry = this.countries.find((c) => c.id === +countryId);
      if (selectedCountry) {
        this.userForm.patchValue({
          currency_code: selectedCountry.currency, // Assuming you have a currency_code control
        });
      }
    } else {
      this.states = [];
      this.cities = [];
      this.userForm.controls['state_id'].setValue('');
      this.userForm.controls['city_id'].setValue('');
    }
  }

  onStateChange() {
    const stateId = this.userForm.controls['state_id'].value;
    if (stateId) {
      this.fetchCities(stateId);
    } else {
      this.cities = [];
      this.userForm.controls['city_id'].setValue('');
    }
  }

  fetchCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.userService.getCities(params).subscribe(
      (response: any) => {
        this.cities = response.data;
        this.userForm.controls['city_id'].setValue('');
      },
      (error) => {
        this.notificationService.showError(
          'Failed to fetch cities. Please try again.',
          'Error'
        );
      }
    );
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

  getCustomerData() {
    const params = new HttpParams();
    this.userCustomerService.getUserCustomers(params).subscribe((response: any) => {
      this.customerData = response.data;
    });
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

  onSellButtonClick() {
    const formData = new FormData();

    // append form controls
    Object.keys(this.userForm.value).forEach(key => {
      formData.append(key, this.userForm.value[key]);
    });

    // append file
    if (this.selectedFile) {
      formData.append('doc_user_img', this.selectedFile, this.selectedFile.name);
    }

    this.userCustomerService.createUserCustomer(formData).subscribe({
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


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedFile = file; // keep file for payload

    this.previewImages = [];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages.push({ name: file.name, url: reader.result as string });
    };
    reader.readAsDataURL(file);
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
