import { UserServiceService } from './../../../../Services/user.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WebcamImage, WebcamModule } from 'ngx-webcam';

import { CustomSelectComponent } from "../../../Core/custom-select/custom-select.component";
import { UserCustomerService } from '../../../../Services/User/Customer/user-customer.service';
import { NotificationService } from './../../../../Services/notification.service';
import { CountryService } from './../../../../Services/country.service';
import { StatesService } from '../../../../Services/states.service';
import { CitiesService } from '../../../../Services/cities.service';
import { GstService } from '../../../../gst.service';
import { States } from '../../../../Models/States';
import { Cities } from '../../../../Models/Cities';
import { Country } from '../../../../Models/country';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    CustomSelectComponent,
    WebcamModule
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit {

  @Output() formReady = new EventEmitter<FormGroup>();
  @Input() customerId: string | null = null;

  personalInfoForm!: FormGroup;
  countries: Country[] = [];
  states: States[] = [];
  cities: Cities[] = [];


  countryTypes: any[] = [];
  stateTypes: any[] = [];
  cityTypes: any[] = [];


  userImagePreview: string | null = null;
  panFrontPreview: string | null = null;
  panBackPreview: string | null = null;
  aadharFrontPreview: string | null = null;
  aadharBackPreview: string | null = null;

  isGstLoading: boolean = false;


  public showWebcam = false;
  private trigger: Subject<void> = new Subject<void>();

  @ViewChild('userImgInput') userImgInput!: ElementRef<HTMLInputElement>;
  @ViewChild('panFrontInput') panFrontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('panBackInput') panBackInput!: ElementRef<HTMLInputElement>;
  @ViewChild('aadharFrontInput') aadharFrontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('aadharBackInput') aadharBackInput!: ElementRef<HTMLInputElement>;
  @Output() userCreated = new EventEmitter<void>();


  customerProductId: any;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private userCustomerService: UserCustomerService,
    private countryService: CountryService,
    private stateService: StatesService,
    private cityService: CitiesService,
    private gstService: GstService,
    private userService: UserServiceService,
    private activateroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    initFlowbite();


    this.initPersonalInfoForm();


    this.getCountries();


    this.customerProductId = this.activateroute.snapshot.params['id'];
    if (this.customerProductId) {
      this.isEditMode = true;
      const userId = parseInt(this.customerProductId);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'customer',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
      this.loadCustomerForEdit(this.customerProductId);
    }


    this.formReady.emit(this.personalInfoForm);
  }


  initPersonalInfoForm() {
    this.personalInfoForm = this.fb.group({
      user_customer_type: [''],
      gstnumber: [''],
      user_registration_type: [''],
      user_title: ['Mr.'],
      name: [''],
      user_middle_name: [''],
      user_last_name: [''],
      user_trade_name: [''],
      email: [''],
      user_gender: ['male'],
      user_dob: [''],
      mobilenumber: [''],
      user_secondary_mobile_no: [''],
      address: [''],
      country_id: [''],
      state_id: [''],
      city_id: [''],
      pincode: [''],
      // user_other_info: [''],
      user_pan_card_no: [''],
      user_aadhar_card_no: [''],
      doc_user_img: [null],
      doc_pan_front_img: [null],
      doc_pan_back_img: [null],
      doc_aadhar_front_img: [null],
      doc_aadhar_back_img: [null],
      user_opening_balance_date: [''],
      user_cash_balance: [''],
      user_cash_balance_type: [''],
      user_sl_weight: [''],
      user_sl_weight_unit: [''],
      user_sl_weight_type: [''],
      user_gd_weight: [''],
      user_gd_weight_unit: [''],
      user_gd_weight_type: [''],
    });
  }


  loadCustomerForEdit(id: any) {
    this.userCustomerService.getUserCustomerById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const customerData = res.data;
          console.log('Customer Data for Edit:', customerData);


          this.personalInfoForm.patchValue(customerData);


          if (customerData.country_id) {
            this.getStates(customerData.country_id);
          }
          if (customerData.state_id) {
            this.getCities(customerData.state_id);
          }


          if (customerData.documents && customerData.documents.length > 0) {
              const docs = customerData.documents[0];
              this.userImagePreview = docs.doc_user_img || null;
              this.panFrontPreview = docs.doc_pan_front_img || null;
              this.panBackPreview = docs.doc_pan_back_img || null;
              this.aadharFrontPreview = docs.doc_aadhar_front_img || null;
              this.aadharBackPreview = docs.doc_aadhar_back_img || null;
          }
        } else {
          this.notificationService.showError('Could not find customer data', 'Error');
        }
      },
      error: (err) => {
        console.error("Error fetching customer for edit:", err);
        this.notificationService.showError('Failed to load customer data', 'Error');
      }
    });
  }


  onSubmit() {
    const formData = new FormData();
    Object.keys(this.personalInfoForm.controls).forEach(key => {
      const control = this.personalInfoForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        formData.append(key, control.value);
      }
    });

    if (this.isEditMode) {
      formData.append('_method', 'PUT');
      this.userCustomerService.updateUserCustomer(this.customerProductId, formData).subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess('Customer updated successfully!', 'Success');
          this.router.navigate(['/user-list/customer']);
        },
        error: (error: any) => {
          this.notificationService.showError('Error updating Customer', 'Error');
        }
      });
    } else {
      this.userCustomerService.createUserCustomer(formData).subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess('Customer added successfully!', 'Success');

          const userId = parseInt(res?.data?.id || res?.id);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'customer',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
          this.clearForm();
        },
        error: (error: any) => {
          this.notificationService.showError('Error creating Customer', 'Error');
        }
      });
    }
  }


  getCountries() {
    this.countryService.getAllCountries().subscribe({
      next: (countries: any) => {
        this.countryTypes = countries.data.map((c: any) => ({ name: c.name, id: c.id }));
      },
      error: (error: any) => {
        console.error('Error fetching countries:', error);
      }
    });
  }


  getStates(countryId: number) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.stateService.getStates(params).subscribe((response: any) => {
      this.stateTypes = response.data.map((s: any) => ({ name: s.name, id: s.id }));
      this.states = response.data;
    });
  }


  getCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.cityService.getCities(params).subscribe((response: any) => {
      this.cityTypes = response.data.map((c: any) => ({ name: c.name, id: c.id }));
      this.cities = response.data;
    });
  }

  onCountryChange() {
    const selectedCountryId = this.personalInfoForm.controls['country_id'].value;
    if (selectedCountryId) {
      this.getStates(selectedCountryId);
    }

    this.personalInfoForm.controls['state_id'].setValue('');
    this.personalInfoForm.controls['city_id'].setValue('');
    this.stateTypes = [];
    this.cityTypes = [];
  }

  onStateChange() {
    const selectedStateId = this.personalInfoForm.controls['state_id'].value;
    if (selectedStateId) {
      this.getCities(selectedStateId);
    }

    this.personalInfoForm.controls['city_id'].setValue('');
    this.cityTypes = [];
  }

  clearForm() {
    this.personalInfoForm.reset();
    this.initPersonalInfoForm();
    this.userImagePreview = null;
    this.panFrontPreview = null;
    this.panBackPreview = null;
    this.aadharFrontPreview = null;
    this.aadharBackPreview = null;


    if (this.userImgInput) this.userImgInput.nativeElement.value = '';
    if (this.panFrontInput) this.panFrontInput.nativeElement.value = '';
    if (this.panBackInput) this.panBackInput.nativeElement.value = '';
    if (this.aadharFrontInput) this.aadharFrontInput.nativeElement.value = '';
    if (this.aadharBackInput) this.aadharBackInput.nativeElement.value = '';


    this.stateTypes = [];
    this.cityTypes = [];
    this.getCountries();
  }

  onFileSelected(event: Event, controlName: string, previewName: keyof this) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.personalInfoForm.patchValue({ [controlName]: file });
      this.personalInfoForm.get(controlName)?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        (this[previewName] as any) = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(inputElement: HTMLInputElement) {
    inputElement.click();
  }

  public toggleWebcam(): void { this.showWebcam = !this.showWebcam; }
  public triggerSnapshot(): void { this.trigger.next(); }
  public get triggerObservable(): Observable<void> { return this.trigger.asObservable(); }

  public handleImage(webcamImage: WebcamImage): void {
    this.userImagePreview = webcamImage.imageAsDataUrl;
    this.showWebcam = false;
    fetch(webcamImage.imageAsDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam_capture.png", { type: "image/png" });
        this.personalInfoForm.patchValue({ doc_user_img: file });
        this.personalInfoForm.get('doc_user_img')?.updateValueAndValidity();
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


  patchData() {
    const gstnumber = this.personalInfoForm.controls['gstnumber'].value?.trim();

    if (!gstnumber) {
      this.notificationService.showError('Please enter a valid GST number', 'Error');
      return;
    }

    this.isGstLoading = true;

    this.gstService.getGstDetails(gstnumber).pipe(
      finalize(() => this.isGstLoading = false)
    ).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          const gstData = response.data;
          this.fetchStatesFromService(gstData.country).subscribe(() => {
            this.personalInfoForm.patchValue({ country_id: gstData.country });
            this.personalInfoForm.patchValue({ state_id: gstData.state });
            this.fetchCitiesFromService(gstData.state).subscribe(() => {
              this.personalInfoForm.patchValue({ city_id: gstData.city });
              this.personalInfoForm.patchValue({
                gstnumber: gstData.gstnumber || '',
                user_trade_name: gstData.name || '',
                email: gstData.email || '',
                address: gstData.address || '',
                pincode: gstData.pincode || '',
              });
              this.notificationService.showSuccess('Data successfully fetched and form updated', 'Success');
            });
          });
        } else {
          this.notificationService.showError('Information not found for this GST number', 'Error');
        }
      },
      (error) => {
        console.error('Error fetching GST details:', error);
        this.notificationService.showError('Failed to fetch GST details. Please try again.', 'Error');
      }
    );
  }

  fetchCountriesFromService() {
    const params = new HttpParams();
    return this.userService.getCountries(params);
  }

  fetchStatesFromService(countryId: number): Observable<any> {
    const params = new HttpParams().set('country_id', countryId.toString());
    return this.userService.getStates(params).pipe(
      finalize(() => {
        this.stateService.getStates(params).subscribe((response: any) => {
          this.stateTypes = response.data.map((s: any) => ({ name: s.name, id: s.id }));
          this.states = response.data;
        });
      })
    );
  }

  fetchCitiesFromService(stateId: number): Observable<any> {
    const params = new HttpParams().set('state_id', stateId.toString());
    return this.userService.getCities(params).pipe(
      finalize(() => {
        this.cityService.getCities(params).subscribe((response: any) => {
          this.cityTypes = response.data.map((c: any) => ({ name: c.name, id: c.id }));
          this.cities = response.data;
        });
      })
    );
  }


  fetchCountries() {
    const params = new HttpParams();
    this.userService.getCountries(params).subscribe(
      (response: any) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
        this.notificationService.showError('Failed to fetch countries. Please try again.', 'Error');
      }
    );
  }


  customerTypes: string[] = ['Wholesale', 'Retailer', 'Direct Customer', 'Family', 'Friend'];
  registrationTypes: string[] = ['Register as Normal taxpayer', 'Registration Under Composition Scheme', 'Casual Taxable Person', 'Non-Resident Taxable Person', 'Input Service Distributor (ISD)', 'Special Economic Zone (SEZ) Developer/Unit', 'E-Commerce Operators', 'Tax Deduction at Source (TDS)'];
  titleTypes: string[] = ['Mr.', 'Mrs.', 'Ms.'];
  wtTypes: string[] = ['GM', 'KG', 'MG'];
  crdrTypes: string[] = ['CR', 'DR'];



  selectedCustomer: string = '';
  selectedRegistration: string = '';
  selectedTitle: string = 'Mr.';
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  selectedWtTypes: string = 'GM';
  selectedCrdrTypes: string = 'CR';
}
