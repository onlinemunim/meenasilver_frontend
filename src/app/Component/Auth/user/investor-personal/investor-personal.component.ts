import { UserServiceService } from './../../../../Services/user.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WebcamImage, WebcamModule } from 'ngx-webcam';

import { CustomSelectComponent } from "../../../Core/custom-select/custom-select.component";
import { UserInvestorService } from './../../../../Services/User/Investor/user-investor.service'; // Corrected path
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
  selector: 'app-investor-personal',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    CustomSelectComponent,
    WebcamModule
  ],
  templateUrl: './investor-personal.component.html',
  styleUrl: './investor-personal.component.css'
})
export class InvestorPersonalComponent implements OnInit {

  userInvestorForm!: FormGroup;
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


  // Properties to manage edit state
  investorProductId: any; // Renamed from supplierProductId
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private NotificationService: NotificationService,
    private userInvestorService: UserInvestorService,
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
    this.initUserInvestorForm();

    // 2. Fetch data for dropdowns that don't depend on other selections.
    this.getCountries();

    // 3. Check for an ID in the route to determine if we are creating or editing.
    this.investorProductId = this.activateroute.snapshot.params['id'];
    if (this.investorProductId) {
      this.isEditMode = true;
      const userId = parseInt(this.investorProductId);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'investor',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
      this.loadInvestorForEdit(this.investorProductId);
    }
  }

  initUserInvestorForm() {
    this.userInvestorForm = this.fb.group({
      user_investor_type: [''],
      user_registration_type: [''],
      gstnumber: [''],
      user_title: ['Mr.'],
      name: [''],
      user_middle_name: [''],
      user_last_name: [''],
      user_investor_id: [''],
      user_trade_name: [''],
      email: [''],
      user_gender: ['male'],
      user_dob: [''],
      mobilenumber: [''],
      user_secondary_mobile_no: [''],
      user_pan_card_no: [''],
      user_aadhar_card_no: [''],

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

      doc_user_img: [null],
      doc_pan_front_img: [null],
      doc_pan_back_img: [null],
      doc_aadhar_front_img: [null],
      doc_aadhar_back_img: [null],
    });
  }

  loadInvestorForEdit(id: any) {
    this.userInvestorService.getUserInvestorById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const investorData = res.data;
          console.log('Investor Data for Edit:', investorData);

          // Patch the form with the fetched data
          this.userInvestorForm.patchValue(investorData);

          // Now, populate the dependent dropdowns based on the patched data
          if (investorData.country_id) {
            this.getStates(investorData.country_id);
          }
          if (investorData.state_id) {
            this.getCities(investorData.state_id);
          }

          // Set image previews from the 'documents' array
          if (investorData.documents && investorData.documents.length > 0) {
            const docs = investorData.documents[0];
            this.userImagePreview = docs.doc_user_img || null;
            this.panFrontPreview = docs.doc_pan_front_img || null;
            this.panBackPreview = docs.doc_pan_back_img || null;
            this.aadharFrontPreview = docs.doc_aadhar_front_img || null;
            this.aadharBackPreview = docs.doc_aadhar_back_img || null;
          }
        } else {
          this.NotificationService.showError('Could not find investor data', 'Error');
        }
      },
      error: (err) => {
        console.error("Error fetching investor for edit:", err);
        this.NotificationService.showError('Failed to load investor data', 'Error');
      }
    });
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.userInvestorForm.controls).forEach(key => {
      const control = this.userInvestorForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        formData.append(key, control.value);
      }
    });

    if (this.isEditMode) {
      // ------ UPDATE LOGIC ------
      formData.append('_method', 'PUT');
      this.userInvestorService.updateUserInvestor(this.investorProductId, formData).subscribe({
        next: (res: any) => {
          this.NotificationService.showSuccess('Investor updated successfully!', 'Success');
          this.router.navigate(['/user-list/investor']);
        },
        error: (error: any) => {
          console.error('Error updating investor:', error);
          this.NotificationService.showError('Error updating Investor', 'Error');
        }
      });
    } else {
      this.userInvestorService.createUserInvestor(formData).subscribe({
        next: (res: any) => {
          this.NotificationService.showSuccess('Investor added successfully!', 'Success');

          const userId = parseInt(res?.data?.id || res?.id);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'investor',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
          this.clearForm();
        },
        error: (error: any) => {
          console.error('Error creating investor:', error);
          this.NotificationService.showError('Error creating Investor', 'Error');
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
    const selectedCountryId = this.userInvestorForm.controls['country_id'].value;
    if (selectedCountryId) {
      this.getStates(selectedCountryId);
    }
    // Reset child dropdowns
    this.userInvestorForm.controls['state_id'].setValue('');
    this.userInvestorForm.controls['city_id'].setValue('');
    this.stateTypes = [];
    this.cityTypes = [];
  }

  onStateChange() {
    const selectedStateId = this.userInvestorForm.controls['state_id'].value;
    if (selectedStateId) {
      this.getCities(selectedStateId);
    }
    // Reset child dropdown
    this.userInvestorForm.controls['city_id'].setValue('');
    this.cityTypes = [];
  }

  clearForm() {
    this.userInvestorForm.reset();
    this.initUserInvestorForm(); // Re-initialize to set default values like 'Mr.'
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
      this.userInvestorForm.patchValue({ [controlName]: file });
      this.userInvestorForm.get(controlName)?.updateValueAndValidity();
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
        this.userInvestorForm.patchValue({ doc_user_img: file });
        this.userInvestorForm.get('doc_user_img')?.updateValueAndValidity();
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
    const gstnumber = this.userInvestorForm.controls['gstnumber'].value?.trim();

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
            this.userInvestorForm.patchValue({ country_id: gstData.country });
            this.userInvestorForm.patchValue({ state_id: gstData.state });
            this.fetchCitiesFromService(gstData.state).subscribe(() => {
              this.userInvestorForm.patchValue({ city_id: gstData.city });
              this.userInvestorForm.patchValue({
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

  // Data for static dropdowns
  InvestorTypes: string[] = ['Money Lender', 'Investor']; // Corrected from CustomerTypes
  registrationTypes: string[] = ['Register as Normal taxpayer', 'Registration Under Composition Scheme', 'Casual Taxable Person', 'Non-Resident Taxable Person', 'Input Service Distributor (ISD)', 'Special Economic Zone (SEZ) Developer/Unit', 'E-Commerce Operators', 'Tax Deduction at Source (TDS)'];
  titleTypes: string[] = ['Mr.', 'Mrs.', 'Ms.'];
  wtTypes: string[] = ['GM', 'KG', 'MG'];
  crdrTypes: string[] = ['CR', 'DR'];

  // The following properties were used for two-way binding with `[(selected)]` on your custom component.
  // Since you are using a Reactive Form, these are not strictly necessary but are kept for compatibility if needed.
  selectedInvestor: string = '';
  selectedRegistration: string = '';
  selectedTitle: string = 'Mr.';
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  selectedWtTypes: string = 'GM';
  selectedCrdrTypes: string = 'CR';
}
