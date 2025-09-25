import { Component, NgZone, OnInit } from '@angular/core';
import { CustomSelectComponent } from "../../../Core/custom-select/custom-select.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../../../Services/country.service';
import { StatesService } from '../../../../Services/states.service';
import { CitiesService } from '../../../../Services/cities.service';
import { HttpParams } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { AddressService } from '../../../../Services/Address/address.service';
import { NotificationService } from '../../../../Services/notification.service';
import { Router,ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-address-details',
  standalone: true,
  imports: [CustomSelectComponent,ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './address-details.component.html',
  styleUrl: './address-details.component.css'
})
export class AddressDetailsComponent implements OnInit{
  addressForm: any;
  addressess: any;
  addressId: any;
  updateButton:boolean = false;
  submitButton:boolean = true;
  userId!: number;
  fullUrl:any;

  countryMap = new Map<number, string>();
  stateMap = new Map<number, string>();
  cityMap = new Map<number, string>();

  constructor(
    private fb:FormBuilder,
    private countryService:CountryService,
    private statesService:StatesService,
    private citiesServiece:CitiesService,
    private addressServiece:AddressService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ){}

  // for Copy From
  copyType: string[] = [
    '1',
  ];
  selectedCopy: string = '';

  // for Address Type
  addressType: string[] = [
    'Billing Address',
    'Shipping Address',
  ];
  selectedAddress: string = '';

  // for Country
  countryTypes: any;
  selectedCountry: string = '';

  getCountries() {
    const params = new HttpParams();
    this.countryService.getCountries(params).subscribe((response: any) => {
      this.countryTypes = response.data;
    });
  }


  // for State
  stateTypes:any;
  selectedState: string = '';

  getStates(countryId: number) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.statesService.getStates(params).subscribe((response: any) => {
      this.stateTypes = response.data;
      this.addressForm.controls['state_id'].setValue('');
      this.cityTypes = [];
      this.addressForm.controls['city_id'].setValue('');
    });
  }


  // for City
  cityTypes:any;
  selectedCity: string = '';
  userType!: string;
  params!:string;

  getCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.citiesServiece.getCities(params).subscribe((response: any) => {
      this.cityTypes = response.data;
      this.addressForm.controls['city_id'].setValue('');
    });
  }

  onCountryChange() {
    const selectedCountryId = this.addressForm.controls['country_id'].value;
    if (selectedCountryId) {
      this.getStates(selectedCountryId);
    }
  }

  onStateChange() {
    const selectedStateId = this.addressForm.controls['state_id'].value;
    if (selectedStateId) {
      this.getCities(selectedStateId);
    }
  }


  ngOnInit(): void {
    this.fullUrl = this.router.url;
    const userInfo = JSON.parse(localStorage.getItem('createdUser') || '{}');
    if (userInfo) {
      this.userId = parseInt(userInfo.id);
      this.userType = userInfo.type;
    }

    this.initAddressForm();
    this.loadInitialData();


    this.addressForm.get('country_id')?.valueChanges.subscribe((countryId: any) => {
      this.onCountryChange();
    });

    this.addressForm.get('state_id')?.valueChanges.subscribe((stateId: any) => {
      this.onStateChange();
    });
  }

  loadInitialData() {
    const params = new HttpParams();

    forkJoin({
      countries: this.countryService.getCountries(params),
      states: this.statesService.getStates(params),
      cities: this.citiesServiece.getCities(params)
    }).pipe(

      tap(lookups => {
        this.countryTypes = lookups.countries.data;
        lookups.countries.data.forEach((c: any) => this.countryMap.set(c.id, c.name));
        lookups.states.data.forEach((s: any) => this.stateMap.set(s.id, s.name));
        lookups.cities.data.forEach((c: any) => this.cityMap.set(c.id, c.name));
      }),

      switchMap(() => this.addressServiece.getAddressDataWithUserType(this.userType,this.userId))
    ).subscribe(
      (response: any) => {
        this.addressess = response.data;
      },
      (error) => {
        this.notificationService.showError('Failed to load page data. Please refresh.', 'Error');
      }
    );
  }

  initAddressForm(){
    this.addressForm = this.fb.group({
      type: [''],
      add1: [''],
      pincode: [''],
      gst_number: [''],
      user_id: [this.userId],
      user_type: [this.userType],
      city_id: [''],
      state_id: [''],
      country_id: ['']
    });
  }

  onSubmit(){
    this.createAddress();
  }

  createAddress() {
    this.addressServiece.createAddress(this.addressForm.value).subscribe(
      (response: any) => {
        this.addressId = response.data.id;
        this.notificationService.showSuccess('Address Created Successfully!', 'Success');
        this.loadInitialData();
        this.clearForm();
      },
      (error: any) => {
        this.notificationService.showError('Failed to create address. Please try again.', 'Error');
      }
    );
  }


  clearForm(){
    this.addressForm.reset({
      user_id: this.userId,
      user_type: this.userType,
    });
    this.submitButton = true;
    this.updateButton = false;
  }

  getAddress(){
    this.addressServiece.getAddressDataWithUserType(this.userType,this.userId).subscribe((response:any)=>{
      this.addressess = response.data;
    })
  }

  deleteAddress(id: any) {
    this.addressServiece.deleteAddress(id).subscribe(
      (response: any) => {
        this.getAddress();
        this.notificationService.showSuccess('Address Deleted Successfully!', 'Success');
      },
      (error: any) => {
        this.notificationService.showError('Failed to delete address. Please try again.', 'Error');
      }
    );
  }

  patchData(id: any) {
    this.addressServiece.getAddress(id).subscribe((response: any) => {
      const addressData = response.data;
      this.addressId = addressData.id;

      // Step 1: Patch the country_id first
      this.addressForm.patchValue({ country_id: addressData.country_id });

      // Step 2: Get states for the country, then patch state_id
      this.statesService.getStates(addressData.country_id).subscribe(states => {
        this.stateTypes = states.data;

        // Delay patching state_id until options are rendered
        setTimeout(() => {
          this.addressForm.patchValue({ state_id: addressData.state_id });

          this.citiesServiece.getCities(addressData.state_id).subscribe(cities => {
            this.cityTypes = cities.data;

            // Delay patching city_id until options are rendered
            setTimeout(() => {
              this.addressForm.patchValue({ city_id: addressData.city_id });

              const cityExists = this.cityTypes.some((city: { id: any; }) => city.id === addressData.city_id);
              if (!cityExists) {
                console.warn('City with id', addressData.city_id, 'not found in cities list');
              }
            });
          });

          this.submitButton = false;
          this.updateButton = true;
        });
      });


      // Patch remaining fields
      this.addressForm.patchValue({
        type: addressData.type,
        add1: addressData.add1,
        pincode: addressData.pincode,
        gst_number: addressData.gst_number,
        user_id: addressData.user_id,
      });
    });
  }


  updateAddress() {
    if (this.addressForm.invalid) {
      this.notificationService.showError('Form is invalid. Please check the fields.', 'Validation Error');
      return;
    }

    this.addressServiece.updateAddress(this.addressId, this.addressForm.value).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Address updated successfully.', 'Success');
        this.getAddress();
        this.clearForm();
      },
      (error: any) => {
        this.notificationService.showError('Failed to update address. Please try again.', 'Error');
      }
    );
  }


  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }


  focusNextOnEnter(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      const target = keyboardEvent.target as HTMLElement;
      const form = target.closest('form');
      if (!form) return;

      const focusable = Array.from(
        form.querySelectorAll<HTMLElement>(
          'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
      ).filter(el => el.tabIndex !== -1 && !el.hidden && el.offsetParent !== null);

      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }

}
