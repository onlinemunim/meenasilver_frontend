import { ApiService } from './../../../../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from "../../../Core/custom-select/custom-select.component";
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { BankService } from '../../../../Services/Bank/bank.service';
import { HttpParams } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationService } from '../../../../Services/notification.service';

@Component({
  selector: 'app-financial-info',
  standalone: true,
  imports: [CustomSelectComponent,ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './financial-info.component.html',
  styleUrl: './financial-info.component.css'
})
export class FinancialInfoComponent implements OnInit{

  bankForm:any;
  banksInfo: any;
  bankInfo: any;
  updateButton: boolean = false;
  submitButton: boolean = true;
  bankId: any;
  userId!: number;
  userType!:String;
  event: any;
  fullUrl:any;


  constructor(private fb:FormBuilder,private bankServiece:BankService,private notificationService:NotificationService,private route: ActivatedRoute){}

  router = inject(Router);

  // for Account type
  accountType: string[] =[
    'Saving',
    'Current',
  ];
  selectedAccount: string = '';

  //  for Bank Name
  bankName: string[] = [
    'SBI',
  ];
  selectedBank: string = '';

  // for Nominee Relation
  nomineeRelation: string[] = [
    'Father',
    'Mother',
    'Spouse',
    'Son',
    'Daughter',
    'Brother',
    'Sister',
    'Grandfather',
    'Grandmother',
    'Uncle',
    'Aunt',
    'Nephew',
    'Niece',
    'Father-in-law',
    'Mother-in-law',
    'Son-in-law',
    'Daughter-in-law',
    'Friend',
    'Cousin',
    'Legal Guardian',
    'Other'
  ];
  selectedNominee: string = '';

  ngOnInit(): void {
    this.fullUrl = this.router.url;
    const userInfo = JSON.parse(localStorage.getItem('createdUser') || '{}');
    if (userInfo) {
      this.userId = parseInt(userInfo.id);
      this.userType = userInfo.type;
    }

    this.initBankForm();
    this.getBanksInfo();
  }


  initBankForm(){
    this.bankForm = this.fb.group({
      bank_account_type: [''],
      bank_acc_no: [''],
      bank_name: [''],
      bank_ifsc_code: [''],
      bank_branch_name: [''],
      bank_nominee_name: [''],
      user_type: [this.userType],
      bank_nominee_relation: [''],
      user_id: [this.userId]
    });
  }


  OnSubmit() {
    if (this.bankForm.invalid) {
      this.notificationService.showError('Form is invalid. Please check the fields.', 'Validation Error');
      return;
    }

    this.bankServiece.createBankInfo(this.bankForm.value).subscribe(
      (response: any) => {
        this.clearForm();
        this.notificationService.showSuccess('Bank information added successfully.', 'Success');
        this.getBanksInfo();
      },
      (error: any) => {
        this.notificationService.showError('Failed to add bank information. Please try again.', 'Error');
      }
    );
  }


  clearForm(){
    this.bankForm.reset({
      user_id: this.userId,
      user_type: this.userType,
    });
    this.submitButton = true;
    this.updateButton = false;
  }

  params:any;
  getBanksInfo(){
      this.bankServiece.getBankDataWithUserType(this.userType,this.userId).subscribe((response:any)=>{
      this.banksInfo = response.data;
    })
  }

  deleteBankDetails(id: any) {
    const confirmDelete = confirm('Are you sure you want to delete this bank information? This action cannot be undone.');

    if (confirmDelete) {
      this.bankServiece.deleteBankInfo(id).subscribe(
        (response: any) => {
          this.notificationService.showSuccess('Bank information has been deleted.', 'Deleted');
          this.getBanksInfo();
        },
        (error: any) => {
          this.notificationService.showError('Failed to delete bank information. Please try again.', 'Error');
        }
      );
    }
  }


  patchForUpdate(id:any){
    this.bankServiece.getBankInfo(id).subscribe((response:any)=>{
      this.bankInfo = response.data;
      this.bankForm.patchValue(this.bankInfo);
      this.submitButton = false;
      this.updateButton = true;
      this.bankId = this.bankInfo.bank_id;
    })
  }

  updateBankDetails() {
    if (this.bankForm.invalid) {
      this.notificationService.showError('Form is invalid. Please check the fields.', 'Validation Error');
      return;
    }

    this.bankServiece.updateBankInfo(this.bankId, this.bankForm.value).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Bank information has been updated successfully.', 'Success');
        this.submitButton = true;
        this.updateButton = false;
        this.getBanksInfo();
        this.clearForm();
      },
      (error: any) => {
        this.notificationService.showError('Failed to update bank information. Please try again.', 'Error');
      }
    );
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
