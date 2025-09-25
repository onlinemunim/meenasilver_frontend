import { UserStaffService } from './../../../../Services/User/Staff/user-staff.service';
import { NotificationService } from './../../../../Services/notification.service';
import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { initFlowbite } from 'flowbite';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatOptionModule } from '@angular/material/core';
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { FirmService } from '../../../../Services/firm.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';

@Component({
  selector: 'app-employment-info',
  standalone: true,
  imports: [
    CustomSelectComponent,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatOptionModule,
  ],
  templateUrl: './employment-info.component.html',
  styleUrl: './employment-info.component.css',
})
export class EmploymentInfoComponent implements OnInit {
  firmSelectionSubscription: any;
  currentFirmId: any;
  constructor(
    private fb: FormBuilder,
    private NotificationService: NotificationService,
    private UserStaffService: UserStaffService,
    private firmService: FirmService,
    private firmSelectionService: FirmSelectionService,
  ) {}

  employmentForm!: FormGroup;
  staffExpDetailsForm!: FormGroup;
  userId!: number;
  userType!: string;
  editButton: boolean = false;
  addButton: boolean = true;
  passwordVisible: boolean = false;
  masterPasswordVisible: boolean = false;

  ngOnInit(): void {
    initFlowbite();
    this.loadFirmList();
    this.employmentform();
    const userInfo = JSON.parse(localStorage.getItem('createdUser') || '{}');
    if (userInfo) {
      this.userId = parseInt(userInfo.id);
      this.userType = userInfo.type;
    }
    this.filteredAssets = this.assetFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAssets(value || ''))
    );
    this.getSingleStaffInfo();
  }

  // Form controls for search and selection
  assetCtrl = new FormControl();
  assetFilterCtrl = new FormControl();
  assets = [
    { name: 'Laptop' },
    { name: 'Charger' },
    { name: 'Phone' },
    { name: 'Tab' },
    { name: 'Pen Drive' },
  ];
  filteredAssets!: Observable<any[]>;

  private _filterAssets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assets.filter((asset) =>
      asset.name.toLowerCase().includes(filterValue)
    );
  }

  // for firm
  firmTypesexperience: string[] = ['firm 1', 'firm 2', 'firm 3'];
  selectedFirmExperience: string = '';

  firmTypes: { id: number; name: string }[] = [];
  selectedFirmType: string = '';

  // for Department
  departmentTypes: string[] = ['Sales', 'CRM', 'Support'];
  selectedDepartment: string = '';

  // for Designation
  designationTypes: string[] = ['Sales Head'];
  selectedDesignation: string = '';

  // for Employee Type
  employeeTypes: string[] = ['Full Time', 'Part Time', 'Intern', 'Freelancer'];
  selectedEmployee: string = '';

  // for Salary Type
  salaryTypes: string[] = ['Fixed', 'Fixed + Variable'];
  selectedSalary: string = '';

  // for Probation Period
  probationTypes: string[] = [
    '1 Month',
    '2 Month',
    '3 Month',
    '4 Month',
    '5 Month',
    '6 Month',
  ];
  selectedProbation: string = '';

  // for Notice Period
  noticeTypes: string[] = ['1 Month', '2 Month', '3 Month'];
  selectedNotice: string = '';

  loadFirmList() {
    this.firmService.getFirms().subscribe((res: any) => {
      this.firmTypes = res.data;
    });
  }

  employmentform() {

    this.employmentForm = this.fb.group({
      user_interview_date: [''],
      user_date_of_joining: [''],
      user_emp_id: [''],
      user_firm_id: [ ''],
      user_department: [''],
      user_designation: [''],
      user_employee_type: [''],
      user_manager: [''],
      user_salary_type: [''],
      user_probation_period: [''],
      user_notice_period: [''],
      user_bio_gate_id: [''],
      user_telegram_bot_id: [''],
      user_telegram_bot_key: [''],
      user_telegram_group_id: [''],
      user_assets: [''],
      // Salary Details
      user_basic_salary: [''],
      user_house_rent_allowance: [''],
      user_other_allowances: [''],
      user_incentives: [''],
      user_deductions: [''],
      user_net_salary: [''],

      // Experience Details (assuming a single experience entry for now)
      user_prev_company_name: [''],
      user_prev_designation: [''],
      user_experience_location: [''],
      user_prev_joining_date: [''],
      user_experience_end_date: [''],
      user_prev_leaving_date: [''],
      user_reason_for_leaving: [''],
      user_total_experience: [''],

      // Existing controls from your original TS, not found in HTML
      user_ifsc_code: [''],
      user_pan_no: [''],
      user_aadhar_no: [''],

      doc_user_resume: [''],
      doc_user_offer_letter: [''],
      doc_user_salary_slip: [''],
      doc_user_experience_letter: [''],
      //login details

      user_login_id: [''],
      password: [''],
      master_password: [''],
    });

    this.staffExpDetailsForm = this.fb.group({
      user_prev_company_name: [''],
      designation: [''],
      location: [''],
      user_prev_joining_date: [''],
      user_prev_leaving_date: [''],
      user_total_experience: [''],
    });

    this.firmSelectionSubscription = this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.currentFirmId = firm?.id;
      // If the form is already initialized, update the firm_id
      if (this.employmentForm) {
        this.employmentForm.get('user_firm_id')?.setValue(this.currentFirmId);
      }
    });
  }

  clearForm() {
    this.employmentForm.reset();
    this.employmentform();
  }

  onSubmit() {
    if (!this.employmentForm.valid) return;

    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.entries(this.employmentForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          if (key === 'user_assets') {
            const assetNames = value.map((item: any) =>
              typeof item === 'string' ? item : item.name
            );
            formData.append('user_assets', JSON.stringify(assetNames));
          } else {
            value.forEach((item) => formData.append(`${key}[]`, String(item)));
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    this.UserStaffService.UpdateEmployment(this.userId, formData).subscribe({
      next: (res: any) => {
        this.NotificationService.showSuccess(
          'Employment Info Updated Successfully',
          'Success'
        );
      },
      error: (err: any) => {
        console.error('Error updating Employment Info:', err);
        this.NotificationService.showError(
          'Error Updating Employment Info',
          'Error'
        );
      },
    });
  }

  allAssets: any;
  empExperienceData: any;

  getSingleStaffInfo() {
    this.UserStaffService.getUserStaffById(this.userId).subscribe(
      (res: any) => {
        const data = res?.data || {};

        this.empExperienceData = data.user_experience_details;

        const excludedFields = [
          'user_prev_company_name',
          'user_prev_designation',
          'user_experience_location',
          'user_prev_joining_date',
          'user_experience_end_date',
          'user_prev_leaving_date',
          'user_reason_for_leaving',
          'user_total_experience',
        ];

        const patchableData: any = {};
        Object.keys(this.employmentForm.controls).forEach((key) => {
          if (!excludedFields.includes(key) && key !== 'user_assets') {
            patchableData[key] = data[key] ?? '';
          }
        });

        this.employmentForm.patchValue(patchableData);

        this.employmentForm.patchValue({
          user_basic_salary: parseFloat(data.user_basic_salary || 0),
          user_house_rent_allowance: parseFloat(
            data.user_house_rent_allowance || 0
          ),
          user_other_allowances: parseFloat(data.user_other_allowances || 0),
          user_incentives: parseFloat(data.user_incentives || 0),
          user_deductions: parseFloat(data.user_deductions || 0),
          user_net_salary: parseFloat(data.user_net_salary || 0),
          user_firm_id: this.currentFirmId || ''
        });

        try {
          const selectedAssetNames: string[] = JSON.parse(
            data.user_assets || '[]'
          );
          const matchedAssets = this.assets.filter((asset) =>
            selectedAssetNames.includes(asset.name)
          );
          this.employmentForm.patchValue({
            user_assets: matchedAssets,
          });
        } catch (e) {
          console.error('Failed to parse user_assets:', e);
          this.employmentForm.patchValue({ user_assets: [] });
        }

        this.employmentForm.patchValue({
          user_login_id: data.email || '',
        });

        // 👇 Patch resume document preview and filename
        const resumeDoc = data.documents?.find(
          (doc: any) => doc.doc_user_resume
        );
        if (resumeDoc && resumeDoc.doc_user_resume) {
          this.resumePreview = resumeDoc.doc_user_resume;
          this.resumeFileName = this.extractFileNameFromUrl(
            resumeDoc.doc_user_resume
          );
        }

        // 👇 Offer Letter
        const offerDoc = data.documents?.find(
          (doc: any) => doc.doc_user_offer_letter
        );
        if (offerDoc && offerDoc.doc_user_offer_letter) {
          this.offerLetterPreview = offerDoc.doc_user_offer_letter;
          this.offerLetterFileName = this.extractFileNameFromUrl(
            offerDoc.doc_user_offer_letter
          );
        }

        // 👇 Salary Slip
        const salaryDoc = data.documents?.find(
          (doc: any) => doc.doc_user_salary_slip
        );
        if (salaryDoc && salaryDoc.doc_user_salary_slip) {
          this.salarySlipPreview = salaryDoc.doc_user_salary_slip;
          this.salarySlipFileName = this.extractFileNameFromUrl(
            salaryDoc.doc_user_salary_slip
          );
        }

        // 👇 Experience Letter
        const experienceDoc = data.documents?.find(
          (doc: any) => doc.doc_user_experience_letter
        );
        if (experienceDoc && experienceDoc.doc_user_experience_letter) {
          this.experienceLetterPreview =
            experienceDoc.doc_user_experience_letter;
          this.experienceLetterFileName = this.extractFileNameFromUrl(
            experienceDoc.doc_user_experience_letter
          );
        }
      }
    );
  }

  extractFileNameFromUrl(url: string): string {
    try {
      return url.substring(url.lastIndexOf('/') + 1);
    } catch {
      return 'resume.png';
    }
  }

  addUserExperience() {
    if (!this.staffExpDetailsForm.valid) return;

    const newExperienceForm = this.staffExpDetailsForm.value;

    const fieldMap: any = {
      user_prev_company_name: 'company_name',
      designation: 'designation',
      location: 'location',
      user_prev_joining_date: 'date_of_joining',
      user_prev_leaving_date: 'date_of_leaving',
      user_total_experience: 'user_total_experience',
    };

    const newExperience: any = {};
    Object.entries(newExperienceForm).forEach(([key, value]) => {
      const backendKey = fieldMap[key];
      if (backendKey) {
        newExperience[backendKey] = value ?? '';
      }
    });

    this.UserStaffService.getUserStaffById(this.userId).subscribe(
      (res: any) => {
        const existingExperiences = res.data.user_experience_details || [];

        const updatedExperiences = [...existingExperiences, newExperience];

        const formData = new FormData();
        formData.append('_method', 'PUT');

        updatedExperiences.forEach((exp, index) => {
          Object.entries(exp).forEach(([key, value]) => {
            formData.append(
              `user_experience_details[${index}][${key}]`,
              String(value ?? '')
            );
          });
        });

        this.UserStaffService.UpdateEmployment(this.userId, formData).subscribe(
          {
            next: (res: any) => {
              this.NotificationService.showSuccess(
                'Experience Info Updated Successfully',
                'Success'
              );
              this.staffExpDetailsForm.reset();
              this.getSingleStaffInfo();
            },
            error: (err: any) => {
              console.error('Error updating Experience Info:', err);
              this.NotificationService.showError(
                'Error Updating Experience Info',
                'Error'
              );
            },
          }
        );
      }
    );
  }

  eid: any;
  patchExperienceData(index: number) {
    this.eid = index;
    this.UserStaffService.getUserStaffById(this.userId).subscribe(
      (res: any) => {
        const experienceList = res.data.user_experience_details;

        if (experienceList && experienceList.length > index) {
          const experience = experienceList[index];

          this.staffExpDetailsForm.patchValue({
            user_prev_company_name: experience.company_name,
            designation: experience.designation,
            location: experience.location,
            user_prev_joining_date: experience.date_of_joining,
            user_prev_leaving_date: experience.date_of_leaving,
            user_total_experience: experience.user_total_experience,
          });
          this.editButton = true;
          this.addButton = false;
        }
      }
    );
  }

  updateUserExperience() {
    const index = this.eid;
    if (!this.staffExpDetailsForm.valid) return;

    const updatedForm = this.staffExpDetailsForm.value;

    const fieldMap: any = {
      user_prev_company_name: 'company_name',
      designation: 'designation',
      location: 'location',
      user_prev_joining_date: 'date_of_joining',
      user_prev_leaving_date: 'date_of_leaving',
      user_total_experience: 'user_total_experience',
    };

    const updatedExperience: any = {};
    Object.entries(updatedForm).forEach(([key, value]) => {
      const backendKey = fieldMap[key];
      if (backendKey) {
        updatedExperience[backendKey] = value ?? '';
      }
    });

    this.UserStaffService.getUserStaffById(this.userId).subscribe(
      (res: any) => {
        const experiences = res.data.user_experience_details || [];

        if (index >= 0 && index < experiences.length) {
          experiences[index] = updatedExperience;
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');

        experiences.forEach(
          (exp: { [s: string]: unknown } | ArrayLike<unknown>, i: any) => {
            Object.entries(exp).forEach(([key, value]) => {
              formData.append(
                `user_experience_details[${i}][${key}]`,
                String(value ?? '')
              );
            });
          }
        );

        this.UserStaffService.UpdateEmployment(this.userId, formData).subscribe(
          {
            next: (res) => {
              this.NotificationService.showSuccess(
                'Experience updated successfully',
                'Success'
              );
              this.editButton = false;
              this.addButton = true;
              this.clearUserExperience();
              this.getSingleStaffInfo();
            },
            error: (err) => {
              this.NotificationService.showError(
                'Error updating experience',
                'Error'
              );
            },
          }
        );
      }
    );
  }

  clearUserExperience() {
    this.staffExpDetailsForm.reset();
    this.editButton = false;
    this.addButton = true;
  }

  deleteUserExperience(index: number) {
    this.UserStaffService.getUserStaffById(this.userId).subscribe(
      (res: any) => {
        let experiences = res.data.user_experience_details || [];

        if (index >= 0 && index < experiences.length) {
          experiences.splice(index, 1);
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');

        experiences.forEach(
          (exp: { [s: string]: unknown } | ArrayLike<unknown>, i: any) => {
            Object.entries(exp).forEach(([key, value]) => {
              formData.append(
                `user_experience_details[${i}][${key}]`,
                String(value ?? '')
              );
            });
          }
        );

        this.UserStaffService.UpdateEmployment(this.userId, formData).subscribe(
          {
            next: (res) => {
              this.NotificationService.showSuccess(
                'Experience deleted successfully',
                'Success'
              );
              this.getSingleStaffInfo();
            },
            error: (err) => {
              this.NotificationService.showError(
                'Error deleting experience',
                'Error'
              );
            },
          }
        );
      }
    );
  }

  resumePreview: string | ArrayBuffer | null = null;
  resumeFileName: string | null = null;
  offerLetterPreview: string | ArrayBuffer | null = null;
  offerLetterFileName: string | null = null;
  salarySlipPreview: string | ArrayBuffer | null = null;
  salarySlipFileName: string | null = null;
  experienceLetterPreview: string | ArrayBuffer | null = null;
  experienceLetterFileName: string | null = null;

  onResumeSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.employmentForm.get('doc_user_resume')?.setValue(file);
      this.resumeFileName = file.name;

      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.resumePreview = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.resumePreview = null;
      }
    }
  }

  onOfferLetterSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.employmentForm.get('doc_user_offer_letter')?.setValue(file);
      this.offerLetterFileName = file.name;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.offerLetterPreview = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.offerLetterPreview = null;
      }
    }
  }

  onSalarySlipSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.employmentForm.get('doc_user_salary_slip')?.setValue(file);
      this.salarySlipFileName = file.name;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.salarySlipPreview = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.salarySlipPreview = null;
      }
    }
  }

  onExperienceLetterSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.employmentForm.get('doc_user_experience_letter')?.setValue(file);
      this.experienceLetterFileName = file.name;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.experienceLetterPreview = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.experienceLetterPreview = null;
      }
    }
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleMasterPasswordVisibility(): void {
    this.masterPasswordVisible = !this.masterPasswordVisible;
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
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
