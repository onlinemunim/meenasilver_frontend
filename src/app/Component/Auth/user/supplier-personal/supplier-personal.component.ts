import { UserServiceService } from './../../../../Services/user.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WebcamImage, WebcamModule } from 'ngx-webcam';

import { CustomSelectComponent } from "../../../Core/custom-select/custom-select.component";
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { NotificationService } from './../../../../Services/notification.service';
import { CountryService } from './../../../../Services/country.service';
import { StatesService } from '../../../../Services/states.service';
import { CitiesService } from '../../../../Services/cities.service';
import { GstService } from '../../../../gst.service';
import { States } from '../../../../Models/States';
import { Cities } from '../../../../Models/Cities';
import { Country } from '../../../../Models/country';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-supplier-personal',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    CustomSelectComponent,
    WebcamModule
  ],
  templateUrl: './supplier-personal.component.html',
  styleUrl: './supplier-personal.component.css'
})
export class SupplierPersonalComponent implements OnInit {

  userSupplierForm!: FormGroup;
  countries: Country[] = [];
  states: States[] = [];
  cities: Cities[] = [];

  // Dropdown data sources
  countryTypes: any[] = [];
  stateTypes: any[] = [];
  cityTypes: any[] = [];

  // Image preview properties
  userImagePreview: string | null = null;
  panFrontPreview: string | null = null;
  panBackPreview: string | null = null;
  aadharFrontPreview: string | null = null;
  aadharBackPreview: string | null = null;

  isGstLoading: boolean = false;

  // Webcam properties
  public showWebcam = false;
  private trigger: Subject<void> = new Subject<void>();

  @ViewChild('userImgInput') userImgInput!: ElementRef<HTMLInputElement>;
  @ViewChild('panFrontInput') panFrontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('panBackInput') panBackInput!: ElementRef<HTMLInputElement>;
  @ViewChild('aadharFrontInput') aadharFrontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('aadharBackInput') aadharBackInput!: ElementRef<HTMLInputElement>;
  @Output() userCreated = new EventEmitter<void>();

  // FIX: Added properties to manage edit state
  supplierProductId: any;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private NotificationService: NotificationService,
    private userSupplierService: UserSupplierService,
    private countryService: CountryService,
    private stateService: StatesService,
    private cityService: CitiesService,
    private gstService: GstService,
    private userService: UserServiceService,
    private activateroute: ActivatedRoute,
    private router: Router // Inject Router for navigation
  ) { }

  ngOnInit(): void {
    // 1. Initialize the form first, always.
    this.initUserSupplierForm();

    // 2. Fetch data for dropdowns that don't depend on other selections.
    this.getCountries();

    // 3. Check for an ID in the route to determine if we are creating or editing.
    this.supplierProductId = this.activateroute.snapshot.params['id'];
    if (this.supplierProductId) {
      this.isEditMode = true;
      const userId = parseInt(this.supplierProductId);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'supplier',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
      this.loadSupplierForEdit(this.supplierProductId);
    }
  }

  // FIX: Corrected form initialization to be cleaner.
  initUserSupplierForm() {
    this.userSupplierForm = this.fb.group({
      user_supplier_type: [''],
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
      user_other_info: [''],
      user_opening_balance_date: [''],
      user_cash_balance: [''],
      user_cash_balance_type: [''],
      user_sl_weight: [''],
      user_sl_weight_unit: [''],
      user_sl_weight_type: [''],
      user_gd_weight: [''],
      user_gd_weight_unit: [''],
      user_gd_weight_type: [''],
      user_pan_card_no: [''],
      user_aadhar_card_no: [''],
      doc_user_img: [null],
      doc_pan_front_img: [null],
      doc_pan_back_img: [null],
      doc_aadhar_front_img: [null],
      doc_aadhar_back_img: [null],
    });
  }

  // FIX: New, structured method to handle loading data for editing.
  loadSupplierForEdit(id: any) {
    this.userSupplierService.getUserSupplierById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const supplierData = res.data;
          console.log('Supplier Data for Edit:', supplierData);

          // Patch the form with the fetched data
          this.userSupplierForm.patchValue(supplierData);

          // Now, populate the dependent dropdowns based on the patched data
          if (supplierData.country_id) {
            this.getStates(supplierData.country_id);
          }
          if (supplierData.state_id) {
            this.getCities(supplierData.state_id);
          }

          // Set image previews from the 'documents' array
          if (supplierData.documents && supplierData.documents.length > 0) {
              const docs = supplierData.documents[0];
              this.userImagePreview = docs.doc_user_img || null;
              this.panFrontPreview = docs.doc_pan_front_img || null;
              this.panBackPreview = docs.doc_pan_back_img || null;
              this.aadharFrontPreview = docs.doc_aadhar_front_img || null;
              this.aadharBackPreview = docs.doc_aadhar_back_img || null;
          }
        } else {
          this.NotificationService.showError('Could not find supplier data', 'Error');
        }
      },
      error: (err) => {
        console.error("Error fetching supplier for edit:", err);
        this.NotificationService.showError('Failed to load supplier data', 'Error');
      }
    });
  }

  // FIX: Updated onSubmit to handle both CREATE and UPDATE logic.
  onSubmit() {
    const formData = new FormData();
    Object.keys(this.userSupplierForm.controls).forEach(key => {
      const control = this.userSupplierForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        formData.append(key, control.value);
      }
    });

    if (this.isEditMode) {
      formData.append('_method', 'PUT');
      this.userSupplierService.updateUserSupplier(this.supplierProductId, formData).subscribe({
        next: (res: any) => {
          this.NotificationService.showSuccess('Supplier updated successfully!', 'Success');
          this.router.navigate(['/user-list/supplier']);
        },
        error: (error: any) => {
          console.error('Error updating supplier:', error);
          this.NotificationService.showError('Error updating Supplier', 'Error');
        }
      });
    } else {
      this.userSupplierService.createUserSupplier(formData).subscribe({
        next: (res: any) => {
          this.NotificationService.showSuccess('Supplier added successfully!', 'Success');

          const userId = parseInt(res?.data?.id || res?.id);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'supplier',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }

          this.clearForm();
        },
        error: (error: any) => {
          console.error('Error creating supplier:', error);
          this.NotificationService.showError('Error creating Supplier', 'Error');
        }
      });
    }
  }

  // FIX: Corrected mapping to use `id` for value binding.
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

  // FIX: Corrected mapping to use `id` for value binding.
  getStates(countryId: number) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.stateService.getStates(params).subscribe((response: any) => {
      this.stateTypes = response.data.map((s: any) => ({ name: s.name, id: s.id }));
      this.states = response.data;
    });
  }

  // FIX: Corrected mapping to use `id` for value binding.
  getCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.cityService.getCities(params).subscribe((response: any) => {
      this.cityTypes = response.data.map((c: any) => ({ name: c.name, id: c.id }));
      this.cities = response.data;
    });
  }

  onCountryChange() {
    const selectedCountryId = this.userSupplierForm.controls['country_id'].value;
    if (selectedCountryId) {
      this.getStates(selectedCountryId);
    }
    // Reset child dropdowns
    this.userSupplierForm.controls['state_id'].setValue('');
    this.userSupplierForm.controls['city_id'].setValue('');
    this.stateTypes = [];
    this.cityTypes = [];
  }

  onStateChange() {
    const selectedStateId = this.userSupplierForm.controls['state_id'].value;
    if (selectedStateId) {
      this.getCities(selectedStateId);
    }
    // Reset child dropdown
    this.userSupplierForm.controls['city_id'].setValue('');
    this.cityTypes = [];
  }

  clearForm() {
    this.userSupplierForm.reset();
    this.initUserSupplierForm(); // Re-initialize to set default values like 'Mr.'
    this.userImagePreview = null;
    this.panFrontPreview = null;
    this.panBackPreview = null;
    this.aadharFrontPreview = null;
    this.aadharBackPreview = null;

    // Reset file input elements if they exist
    if (this.userImgInput) this.userImgInput.nativeElement.value = '';
    if (this.panFrontInput) this.panFrontInput.nativeElement.value = '';
    if (this.panBackInput) this.panBackInput.nativeElement.value = '';
    if (this.aadharFrontInput) this.aadharFrontInput.nativeElement.value = '';
    if (this.aadharBackInput) this.aadharBackInput.nativeElement.value = '';

    // Reset dropdowns
    this.stateTypes = [];
    this.cityTypes = [];
  }

  onFileSelected(event: Event, controlName: string, previewName: keyof this) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.userSupplierForm.patchValue({ [controlName]: file });
      this.userSupplierForm.get(controlName)?.updateValueAndValidity();
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
        this.userSupplierForm.patchValue({ doc_user_img: file });
        this.userSupplierForm.get('doc_user_img')?.updateValueAndValidity();
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

  // --- GST and Dropdown data fetch logic (No changes needed here) ---

  patchData() {
    const gstnumber = this.userSupplierForm.controls['gstnumber'].value?.trim();

    if (!gstnumber) {
      this.NotificationService.showError('Please enter a valid GST number', 'Error');
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
            this.userSupplierForm.patchValue({ country_id: gstData.country });
            this.userSupplierForm.patchValue({ state_id: gstData.state });
            this.fetchCitiesFromService(gstData.state).subscribe(() => {
              this.userSupplierForm.patchValue({ city_id: gstData.city });
              this.userSupplierForm.patchValue({
                gstnumber: gstData.gstnumber || '',
                user_trade_name: gstData.name || '',
                email: gstData.email || '',
                address: gstData.address || '',
                pincode: gstData.pincode || '',
              });
              this.NotificationService.showSuccess('Data successfully fetched and form updated', 'Success');
            });
          });
        } else {
          this.NotificationService.showError('Information not found for this GST number', 'Error');
        }
      },
      (error) => {
        console.error('Error fetching GST details:', error);
        this.NotificationService.showError('Failed to fetch GST details. Please try again.', 'Error');
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

  // NOTE: This method seems redundant as getCountries() already exists.
  // You might want to consolidate them, but leaving it as is for now.
  fetchCountries() {
    const params = new HttpParams();
    this.userService.getCountries(params).subscribe(
      (response: any) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
        this.NotificationService.showError('Failed to fetch countries. Please try again.', 'Error');
      }
    );
  }

  // Data for static dropdowns
  supplierTypes: string[] = ['Whole Seller', 'Retailer', 'Manufacturer', 'Karigar', 'Outstation Supplier', 'kalakar', 'Other'];
  registrationTypes: string[] = ['Register as Normal taxpayer', 'Registration Under Composition Scheme', 'Casual Taxable Person', 'Non-Resident Taxable Person', 'Input Service Distributor (ISD)', 'Special Economic Zone (SEZ) Developer/Unit', 'E-Commerce Operators', 'Tax Deduction at Source (TDS)'];
  titleTypes: string[] = ['Mr.', 'Mrs.', 'Ms.'];
  wtTypes: string[] = ['GM', 'KG', 'MG'];
  crdrTypes: string[] = ['CR', 'DR'];

  // The following properties were used for two-way binding with `[(selected)]` on your custom component.
  // Since you are using a Reactive Form, these are not strictly necessary but are kept for compatibility if needed.
  selectedSupplier: string = '';
  selectedRegistration: string = '';
  selectedTitle: string = 'Mr.';
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  selectedWtTypes: string = 'GM';
  selectedCrdrTypes: string = 'CR';
}
