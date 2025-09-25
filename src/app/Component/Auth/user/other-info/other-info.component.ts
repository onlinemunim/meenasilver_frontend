import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { NotificationService } from './../../../../Services/notification.service';
import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from "../../../Core/custom-select/custom-select.component";
import { initFlowbite } from 'flowbite';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserInvestorService } from '../../../../Services/User/Investor/user-investor.service';
import { UserCustomerService } from '../../../../Services/User/Customer/user-customer.service';

@Component({
  selector: 'app-other-info',
  standalone: true,
  imports: [CustomSelectComponent,ReactiveFormsModule, CommonModule],
  templateUrl: './other-info.component.html',
  styleUrl: './other-info.component.css'
})
export class OtherInfoComponent implements OnInit{

  otherInfoForm !: FormGroup;
  userId!:number;
  userType!:string;
  fullUrl!:string;

  passwordVisible: boolean = false;
  masterPasswordVisible: boolean = false;
  data: any;

  constructor(
    private fb:FormBuilder,
    private NotificationService: NotificationService,
    private UserSupplierService: UserSupplierService,
    private router:Router,
    private userCustomerService:UserCustomerService,
    private userInvestorService:UserInvestorService
  ){}

  ngOnInit(): void {
    this.fullUrl = this.router.url;
    initFlowbite();

    const userInfo = JSON.parse(localStorage.getItem('createdUser') || '{}');
    if (userInfo) {
      this.userId = parseInt(userInfo.id);
      this.userType = userInfo.type;
    }

    this.initOtherInfoForm();
    this.patchData();
  }

  initOtherInfoForm() {
    this.otherInfoForm = this.fb.group({
      user_marital_status: [''],
      user_spouse_dob: [''],
      user_anniversary_date: [''],
      user_father_name: [''],
      user_mother_name: [''],
      user_wife_name: [''],
      user_alternative_no: [''],
      user_reference: [''],
      user_login_id: [''],
      password: [''],
      master_password: [''],
      user_other_info: [''],

    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleMasterPasswordVisibility(): void {
    this.masterPasswordVisible = !this.masterPasswordVisible;
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.otherInfoForm.controls).forEach(key => {
      const control = this.otherInfoForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        formData.append(key, control.value);
      }
    });


    formData.append('_method', 'PUT');

    this.UserSupplierService.updateUserSupplier(this.userId, formData).subscribe({
      next: (res: any) => {
        this.NotificationService.showSuccess('Other Info Updated Successfully', 'Success');
      },
      error: (err: any) => {
        this.NotificationService.showError('Error Updating Other Info', 'Error');
      }
    });
  }


  clearForm() {
    this.otherInfoForm.reset();
    this.initOtherInfoForm();
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault()
      const target = keyboardEvent.target as HTMLElement;
      const form = target.closest('form');
      if (!form) return
      const focusable = Array.from(
        form.querySelectorAll<HTMLElement>('input, select, textarea, button')
      ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1)
      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }

  patchData() {
    if (this.fullUrl === '/create-user/add-customer' || this.fullUrl.includes('customer')) {
      this.userCustomerService.getUserCustomerById(this.userId).subscribe((res: any) => {
        this.data = res.data;
        this.otherInfoForm.patchValue(this.data);
        this.otherInfoForm.patchValue({
          user_login_id : this.data.email,
        })
      });
    } else if (this.fullUrl === '/create-user/add-supplier' || this.fullUrl.includes('supplier')) {
      this.UserSupplierService.getUserSupplierById(this.userId).subscribe((res: any) => {
        this.data = res.data;
        this.otherInfoForm.patchValue(this.data);
        this.otherInfoForm.patchValue({
          user_login_id : this.data.email,
        })
      });
    } else if (this.fullUrl === '/create-user/add-investor' || this.fullUrl.includes('investor')) {
      this.userInvestorService.getUserInvestorById(this.userId).subscribe((res: any) => {
        this.data = res.data;
        this.otherInfoForm.patchValue(this.data);
        this.otherInfoForm.patchValue({
          user_login_id : this.data.email,
        })
      });
    }
  }

  maritalStatus: string[] = [
    'Single',
    'Married',
    'divorced',
    'widowed'
  ];
  selectedStatus: string = '';
}
