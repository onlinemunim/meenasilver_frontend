// src/app/Components/User/add-user/staff-personal/staff-personal.component.ts

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

// Webcam and Core Components
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';

// Services
import { UserStaffService } from '../../../../Services/User/Staff/user-staff.service';
import { NotificationService } from './../../../../Services/notification.service';
import { CountryService } from './../../../../Services/country.service';
import { StatesService } from '../../../../Services/states.service';
import { CitiesService } from '../../../../Services/cities.service';

// Models
import { Country } from '../../../../Models/country';
import { States } from '../../../../Models/States';
import { Cities } from '../../../../Models/Cities';

@Component({
  selector: 'app-staff-personal',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    CustomSelectComponent,
    WebcamModule
  ],
  templateUrl: './staff-personal.component.html',
  styleUrls: ['./staff-personal.component.css']
})
export class StaffPersonalComponent implements OnInit {

  userStaffForm!: FormGroup;

  // Dropdown data sources
  countries: Country[] = [];
  states: States[] = [];
  cities: Cities[] = [];
  countryTypes: any[] = [];
  stateTypes: any[] = [];
  cityTypes: any[] = [];

  // Image preview properties
  userImagePreview: string | null = null;
  panFrontPreview: string | null = null;
  panBackPreview: string | null = null;
  aadharFrontPreview: string | null = null;
  aadharBackPreview: string | null = null;

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
  staffId: any;
  isEditMode: boolean = false;

  titleTypes: string[] = ['Mr.', 'Mrs.', 'Ms.'];

  constructor(
    private fb: FormBuilder,
    private userStaffService: UserStaffService,
    private notificationService: NotificationService,
    private countryService: CountryService,
    private stateService: StatesService,
    private cityService: CitiesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initUserStaffForm();
    this.getCountries();

    this.staffId = this.activatedRoute.snapshot.params['id'];
    if (this.staffId) {
      this.isEditMode = true;
      const userId = parseInt(this.staffId);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'staff',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
      this.loadStaffForEdit(this.staffId);
    }
  }

  initUserStaffForm() {
    this.userStaffForm = this.fb.group({
      user_title: ['Mr.'],
      name: [''],
      user_middle_name: [''],
      user_last_name: [''],
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
      user_pan_card_no: [''],
      user_aadhar_card_no: [''],
      doc_user_img: [null],
      doc_pan_front_img: [null],
      doc_pan_back_img: [null],
      doc_aadhar_front_img: [null],
      doc_aadhar_back_img: [null],
    });
  }

  // UPDATED: This method now correctly handles nested data and assumes full image URLs from the API.
  loadStaffForEdit(id: any) {
    this.userStaffService.getUserStaffById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const staffData = res.data;

          // 1. Patch the main form fields from the root of the staff data object.
          this.userStaffForm.patchValue(staffData);

          // 2. Handle nested address data. `patchValue` won't find these automatically.
          if (staffData.addresses && staffData.addresses.length > 0) {
            const address = staffData.addresses[0];
            this.userStaffForm.patchValue({
              address: address.add1,
              country_id: address.country_id,
              state_id: address.state_id,
              city_id: address.city_id,
              pincode: address.pincode,
            });

            // 3. Load dependent dropdowns now that the IDs are set.
            if (address.country_id) this.getStates(address.country_id);
            if (address.state_id) this.getCities(address.state_id);
          }

          // 4. Set image previews by directly assigning the URL from the API response.
          //    This assumes the backend provides the full URL for each document.
          if (staffData.documents && staffData.documents.length > 0) {
            const docs = staffData.documents[0];
            this.userImagePreview = docs.doc_user_img || null;
            this.panFrontPreview = docs.doc_pan_front_img || null;
            this.panBackPreview = docs.doc_pan_back_img || null;
            this.aadharFrontPreview = docs.doc_aadhar_front_img || null;
            this.aadharBackPreview = docs.doc_aadhar_back_img || null;
          }
        } else {
          this.notificationService.showError('Could not find staff data', 'Error');
        }
      },
      error: (err) => {
        console.error("Error fetching staff for edit:", err);
        this.notificationService.showError('Failed to load staff data', 'Error');
      }
    });
  }

    onSubmit() {
      const formData = new FormData();
      Object.keys(this.userStaffForm.controls).forEach(key => {
        const control = this.userStaffForm.get(key);
        if (control && control.value !== null && control.value !== undefined) {
          formData.append(key, control.value);
        }
      });

      if (this.isEditMode) {
        formData.append('_method', 'PUT');
      }

      const apiCall = this.isEditMode
        ? this.userStaffService.updateUserStaff(this.staffId, formData)
        : this.userStaffService.createUserStaff(formData);

      const action = this.isEditMode ? 'updated' : 'created';

      apiCall.subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess(`Staff ${action} successfully!`, 'Success');

          const userId = parseInt(res?.data?.id || res?.id);
          if (!isNaN(userId)) {
            const userInfo = {
              id: userId,
              type: 'staff',
            };
            localStorage.setItem('createdUser', JSON.stringify(userInfo));
            this.userCreated.emit();
          }
          this.clearForm();
        },
        error: (error: any) => {
          console.error(`Error ${action} staff:`, error);
          this.notificationService.showError(`Error ${action} Staff`, 'Error');
        }
      });
    }

  getCountries() {
    this.countryService.getAllCountries().subscribe({
      next: (res: any) => this.countryTypes = res.data.map((c: any) => ({ name: c.name, id: c.id })),
      error: (err) => console.error('Error fetching countries:', err)
    });
  }

  getStates(countryId: number) {
    const params = new HttpParams().set('country_id', String(countryId));
    this.stateService.getStates(params).subscribe((res: any) => {
      this.stateTypes = res.data.map((s: any) => ({ name: s.name, id: s.id }));
    });
  }

  getCities(stateId: number) {
    const params = new HttpParams().set('state_id', String(stateId));
    this.cityService.getCities(params).subscribe((res: any) => {
      this.cityTypes = res.data.map((c: any) => ({ name: c.name, id: c.id }));
    });
  }

  onCountryChange() {
    const countryId = this.userStaffForm.controls['country_id'].value;
    this.userStaffForm.controls['state_id'].setValue('');
    this.userStaffForm.controls['city_id'].setValue('');
    this.stateTypes = [];
    this.cityTypes = [];
    if (countryId) this.getStates(countryId);
  }

  onStateChange() {
    const stateId = this.userStaffForm.controls['state_id'].value;
    this.userStaffForm.controls['city_id'].setValue('');
    this.cityTypes = [];
    if (stateId) this.getCities(stateId);
  }

  clearForm() {
    this.userStaffForm.reset();
    this.initUserStaffForm();
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
  }

  onFileSelected(event: Event, controlName: string, previewName: keyof this) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.userStaffForm.patchValue({ [controlName]: file });
      this.userStaffForm.get(controlName)?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => { (this[previewName] as any) = reader.result as string; };
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
        this.userStaffForm.patchValue({ doc_user_img: file });
        this.userStaffForm.get('doc_user_img')?.updateValueAndValidity();
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
