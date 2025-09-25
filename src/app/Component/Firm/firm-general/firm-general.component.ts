import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FirmService } from '../../../Services/firm.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../Services/notification.service';
import { GstService } from '../../../gst.service';
import { UserServiceService } from '../../../Services/user.service';
import { HttpParams } from '@angular/common/http';
import { Country } from '../../../Models/country';
import { States } from '../../../Models/States';
import { Cities } from '../../../Models/Cities';
import { ApiService } from '../../../Services/api.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-firm-general',
  standalone: true,
  imports: [FormsModule, NgFor, ReactiveFormsModule, CommonModule],
  templateUrl: './firm-general.component.html',
  styleUrl: './firm-general.component.css',
})
export class FirmGeneralComponent implements OnInit {
  createdFirmId!: number;
  firmForm!: FormGroup;
  countries: Country[] = [];
  states: States[] = [];
  cities: Cities[] = [];
  isGstLoading: boolean = false;
  errorMessage: string = '';
  firmTypes: string[] = [];
  selectedFile!: File;
  files: { [key: string]: File } = {};

  leftLogoPreview: string | ArrayBuffer | null = null;
  rightLogoPreview: string | ArrayBuffer | null = null;
  signaturePreview: string | ArrayBuffer | null = null;
  qrCodePreview: string | ArrayBuffer | null = null;

  leftLogoFile: File | null = null;
  rightLogoFile: File | null = null;
  signatureFile: File | null = null;
  qrCodeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private firmService: FirmService,
    private router: Router,
    public notificationService: NotificationService,
    public gstService: GstService,
    private userService: UserServiceService
  ) {}
  selectedFirmType: string = '';

  ngOnInit(): void {
    this.firmService.setFirmId(null);

    this.firmTypes = this.firmService.getFirmTypes();
    this.fetchCountries();
    this.initFirmForm();
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
        this.cities = [];

        this.firmForm.controls['state_id'].setValue('');
        this.firmForm.controls['city_id'].setValue('');

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
    const countryId = this.firmForm.controls['country_id'].value;
    if (countryId) {
      this.fetchStates(countryId);
      const selectedCountry = this.countries.find((c) => c.id === +countryId);
      if (selectedCountry) {
        this.firmForm.patchValue({
          currency_code: selectedCountry.currency,
        });
      }
    }
  }
  onStateChange() {
    const stateId = this.firmForm.controls['state_id'].value;
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
            (city: any) => city.name === this.firmForm.controls['city_id'].value
          );
          if (selectedCity) {
            this.firmForm.controls['city_id'].setValue(selectedCity.id);
          } else {
            this.firmForm.controls['city_id'].setValue(this.cities[0].id);
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

  initFirmForm() {
    this.firmForm = this.fb.group({
      gst_no: ['', [Validators.maxLength(255)]],
      firm_shortid: ['', [Validators.required]],
      category: ['', [Validators.required]],
      type: ['', [Validators.required]],
      gst_status: [''],
      name: ['', [Validators.maxLength(255)]],
      trade_name: ['', [Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(255)]],
      address: ['', [Validators.maxLength(100)]],
      country_id: ['', [Validators.required]],
      pincode: ['', [Validators.maxLength(10)]],
      city_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      currency_code: ['', [Validators.required]],
      phone_no: ['', [Validators.maxLength(20),Validators.pattern('^[0-9]*$')]],
      email: ['', [ Validators.email]],
      website: [''],
      registration_no: [''],
      pan_no: [''],
      cin_no: [''],
      ice_no: [''],
      tan_no: [''],
      comments_other_info: [
        '',
        [ Validators.maxLength(500)],
      ],
      geo_location_latitude: [''],
      geo_location_longitude: [''],
      fin_year_start_date: ['', [Validators.required]],
      principla_amt_limit_form: [''],
      principla_amt_limit_to: [''],
    });
  }

  patchData() {
    const gstnumber = this.firmForm.controls['gst_no'].value?.trim();

    if (!gstnumber) {
      this.notificationService.showError(
        'Please enter a valid GST number',
        'Error'
      );
      return;
    }

    this.isGstLoading = true;

    this.gstService.getGstDetails(gstnumber).subscribe(
      (response: any) => {

        if (response.success) {
          this.fetchStates(response.data.country, () => {
            this.patchFormData(response);
          });

          this.notificationService.showSuccess(
            'Data successfully fetched and form updated',
            'Success'
          );
        } else {
          this.notificationService.showError(
            'Information not found for this GST number',
            'Error'
          );
        }

        this.isGstLoading = false;
      },
      (error) => {
        this.isGstLoading = false;
        console.error('Error fetching GST details:', error);
        this.notificationService.showError(
          'Failed to fetch GST details. Please try again.',
          'Error'
        );
      }
    );
  }

  patchFormData(response: any) {
    if (response && response.data) {
      const gstData = response.data;

      this.firmForm.patchValue({
        gst_no: gstData.gstnumber || '',
        name: gstData.name || '',
        email: gstData.email || '',
        address: gstData.address || '',
        city_id: gstData.city || null,
        state_id: gstData.state || null,
        country_id: gstData.country || '',
        pincode: gstData.pincode || '',
      });

      if (gstData.state) {
        this.fetchCities(gstData.state);
      }
    } else {
      console.error('Invalid response data:', response);
      this.notificationService.showError('Error fetching data', 'Error');
    }
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value;
  }

  onFileSelected(
    event: Event,
    field: 'left_logo_img' | 'right_logo_img' | 'signature_img' | 'qr_code_img'
  ) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        switch (field) {
          case 'left_logo_img':
            this.leftLogoFile = file;
            this.leftLogoPreview = reader.result;
            break;
          case 'right_logo_img':
            this.rightLogoFile = file;
            this.rightLogoPreview = reader.result;
            break;
          case 'signature_img':
            this.signatureFile = file;
            this.signaturePreview = reader.result;
            break;
          case 'qr_code_img':
            this.qrCodeFile = file;
            this.qrCodePreview = reader.result;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(type: string): void {
    this.firmForm.patchValue({ [type]: null });
    switch (type) {
      case 'left_logo_img':
        this.leftLogoPreview = null;
        break;
      case 'right_logo_img':
        this.rightLogoPreview = null;
        break;
      case 'signature_img':
        this.signaturePreview = null;
        break;
      case 'qr_code_img':
        this.qrCodePreview = null;
        break;
    }
  }
  clearForm() {
    this.firmForm.reset();
    this.leftLogoPreview =
      this.rightLogoPreview =
      this.signaturePreview =
      this.qrCodePreview =
        null;
    this.leftLogoFile =
      this.rightLogoFile =
      this.signatureFile =
      this.qrCodeFile =
        null;
  }

  onSubmit(): void {
    if (this.firmForm.invalid) {
    this.firmForm.markAllAsTouched();
    this.notificationService.showError(
    'Please fill all required fields.',
    'Validation Error'
    );
    return;
    }

    const formData = new FormData();

    Object.keys(this.firmForm.controls).forEach((key) => {
    const controlValue = this.firmForm.get(key)?.value;

    if (controlValue instanceof File) {
    formData.append(key, controlValue);
    } else {
    formData.append(key, controlValue ?? '');
    }
    });

    if (this.leftLogoFile) formData.append('left_logo_img', this.leftLogoFile);
    if (this.rightLogoFile)
    formData.append('right_logo_img', this.rightLogoFile);
    if (this.signatureFile)
    formData.append('signature_img', this.signatureFile);
    if (this.qrCodeFile) formData.append('qr_code_img', this.qrCodeFile);

    this.firmService.createFirm(formData).subscribe({
    next: (response) =>
    {
    const firmGeneral =response?.data?.id;
    localStorage.setItem('firmIdFromGeneral', JSON.stringify(firmGeneral));

    this.firmService.setFirmId(firmGeneral);

    this.notificationService.showSuccess(
    'Firm created successfully!',
    'Success'
    );
    this.firmService.notifyFirmsUpdated();
    this.firmForm.reset();
    this.leftLogoPreview =
    this.rightLogoPreview =
    this.signaturePreview =
    this.qrCodePreview =
    null;

    this.leftLogoFile =
    this.rightLogoFile =
    this.signatureFile =
    this.qrCodeFile =
    null;

    this.router.navigate(['/firm-create']);
    },
    error: () => {
    this.notificationService.showError(
    'Failed to create firm. Please try again.',
    'Submission Error'
    );
    },
    });
    }
    }


