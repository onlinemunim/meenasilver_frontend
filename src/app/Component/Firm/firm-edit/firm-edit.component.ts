import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FirmService } from '../../../Services/firm.service';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { Cities } from '../../../Models/Cities';
import { Country } from '../../../Models/country';
import { States } from '../../../Models/States';
import { HttpParams } from '@angular/common/http';
import { UserServiceService } from '../../../Services/user.service';
import { NotificationService } from '../../../Services/notification.service';
import { GstService } from '../../../gst.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firm-edit',
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './firm-edit.component.html',
  styleUrl: './firm-edit.component.css',
})
export class FirmEditComponent implements OnInit {
  firmForm!: FormGroup;

  firmsData: any;

  singleCountry: any;
  currency: any;
  singleState: any;
  statename: any;
  singleCity: any;
  cityname: any;
  firmId: any;
  countries: Country[] = [];
  states: States[] = [];
  cities: Cities[] = [];
  isGstLoading: boolean = false;
  uploadedImageLeft: string | ArrayBuffer | null = null;
  uploadedImageRight: string | ArrayBuffer | null = null;
  uploadedImageSign: string | ArrayBuffer | null = null;
  uploadedImageQR: string | ArrayBuffer | null = null;
  fileUploadError: { [key: string]: string } = {};
  firmTypes: any;


  constructor(
    private fb: FormBuilder,
    private firmService: FirmService,
    private userService: UserServiceService,
    public notificationService: NotificationService,
    public gstService: GstService,
    private router: Router
  ) { }

  activateroute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.firmTypes = this.firmService.getFirmTypes();
    this.firmId = this.activateroute.snapshot.params['id'];
    this.initFirmForm();
    this.fetchCountries();
    this.fetchFirms();
  }

  fetchCountries() {
    const params = new HttpParams();

    this.userService.getCountries(params).subscribe(
      (response: any) => {
        this.countries = response.data;

        if (this.firmsData?.address?.country_id) {
          const currency = this.getCurrencyByCountryId(
            this.firmsData.address.country_id
          );
          this.firmForm.patchValue({ currency_code: currency });
        }
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
    const cid = countryId;
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
        this.firmForm.controls['city_id'].reset('');
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
      gst_no: ['', Validators.required],
      firm_shortid: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      gst_status: ['', Validators.required],
      name: ['', Validators.required],
      trade_name: ['', [Validators.maxLength(255)]],
      description: ['', Validators.required],
      address: ['', Validators.required],
      city_id: ['', Validators.required],
      state_id: ['', Validators.required],
      country_id: ['', Validators.required],
      pincode: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.maxLength(20)]],
      currency_code: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.required, Validators.pattern('https?://.+')]],
      registration_no: ['', Validators.required],
      pan_no: ['', Validators.required],
      cin_no: ['', Validators.required],
      ice_no: ['', Validators.required],
      tan_no: ['', Validators.required],
      comments_other_info: ['', [Validators.required, Validators.maxLength(500)]],
      geo_location_latitude: ['', [Validators.required,]],
      geo_location_longitude: ['', [Validators.required,]],
      fin_year_start_date: ['', Validators.maxLength],
      principla_amt_limit_form: ['', [Validators.required, Validators.min, Validators.pattern]],
      principla_amt_limit_to: ['', Validators.maxLength],
      left_logo_img: [''],
      right_logo_img: [''],
      signature_img: [''],
      qr_code_img: [''],
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
        gstnumber: gstData.gstnumber || '',
        name: gstData.name || '',
        mobilenumber: gstData.mobilenumber || '',
        email: gstData.email || '',
        address: gstData.address || '',
        city: gstData.city || null,
        state: gstData.state || null,
        country: gstData.country || '',
        pincode: gstData.pincode || '',
        billingname: gstData.billingname || '',
      });

      if (gstData.state) {
        this.fetchCities(gstData.state);
      }
    } else {
      console.error('Invalid response data:', response);
      this.notificationService.showError('Error fetching data', 'Error');
    }
  }

  fetchFirms() {
    this.firmService.getFirm(this.firmId).subscribe((response) => {
      const firm = response.data;

      this.firmsData = firm;

    this.firmForm.patchValue({
        ...firm,
        address: firm.address?.add1,
        state_id: firm.address?.state.id,
        city_id: firm.address?.city.id,
        country_id: firm.address?.country.id,
        currency: this.getCurrencyByCountryId(firm.address?.country.id),
        pincode: firm.address?.pincode,
      });

      this.uploadedImageLeft = this.cleanImageUrl(firm.left_logo_img);
      this.uploadedImageRight = this.cleanImageUrl(firm.right_logo_img);
      this.uploadedImageSign = this.cleanImageUrl(firm.signature_img);
      this.uploadedImageQR = this.cleanImageUrl(firm.qr_code_img);


      const countryId = firm.address?.country.id;
      const stateId = firm.address?.state.id;
      if (countryId) {
        this.getStates(countryId);
      }

      if (stateId) {
        this.getCities(stateId);
      }
    });
  }

  cleanImageUrl(url: string): string | null {
    if (!url) return null;

    const pattern = /http.*?\/storage\/firms\/[a-zA-Z0-9_\-\.]+/;
    const match = url.match(pattern);
    return match ? match[0] : null;
  }



  getCurrencyByCountryId(countryId: number): string | null {
    const country = this.countries.find((c) => c.id === countryId);
    return country ? country.currency : null;
  }

  onSubmit() {
    const formValue = this.firmForm.value;

    const formData = new FormData();

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        if (formValue[key] instanceof File) {
          formData.append(key, formValue[key]);
        } else {
          formData.append(key, formValue[key]);
        }
      }
    }

    this.firmService.editFirmsData(this.firmId, formData).subscribe(
      (response: any) => {

        localStorage.setItem('firmIdFromGeneral', JSON.stringify(this.firmId));
        this.firmService.setFirmId(this.firmId);

        this.notificationService.showSuccess('Firm updated successfully', 'Success');
      },
      (error) => {
        console.error('Error while updating firm', error);
        this.notificationService.showError('Failed to update firm', 'Error');
      }
    );
  }

  clearForm() {
    this.firmForm.reset();
  }

  onFileSelected(event: Event, type: 'left' | 'right' | 'sign' | 'qrcode'): void {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError[type] = 'Only JPEG and PNG files are allowed.';
        target.value = '';
        return;
      } else {
        this.fileUploadError[type] = '';
      }

      switch (type) {
        case 'left':
          this.firmForm.patchValue({ left_logo_img: file });
          this.uploadedImageLeft = URL.createObjectURL(file);
          break;
        case 'right':
          this.firmForm.patchValue({ right_logo_img: file });
          this.uploadedImageRight = URL.createObjectURL(file);
          break;
        case 'sign':
          this.firmForm.patchValue({ signature_img: file });
          this.uploadedImageSign = URL.createObjectURL(file);
          break;
        case 'qrcode':
          this.firmForm.patchValue({ qr_code_img: file });
          this.uploadedImageQR = URL.createObjectURL(file);
          break;
      }
    }
  }


  getStates(countryId: number, callbackFunction: any = null) {
    const params = new HttpParams().set('country_id', countryId.toString());
    this.userService.getStates(params).subscribe((response: any) => {
      this.states = response.data;
    });
  }

  getCities(stateId: number) {
    const params = new HttpParams().set('state_id', stateId.toString());
    this.userService.getCities(params).subscribe((response: any) => {
      this.cities = response.data;
    });
  }
}
