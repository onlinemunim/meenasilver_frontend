import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import {FormBuilder,ReactiveFormsModule,FormGroup,Validators,} from '@angular/forms';
import { VoucherService } from '../../../Services/voucher.service';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-createvoucher',
  imports: [ReactiveFormsModule,CommonModule,MatSnackBarModule],
  templateUrl: './createvoucher.component.html',
  styleUrl: './createvoucher.component.css',
})
export class CreatevoucherComponent implements OnInit {
  createVoucherForm!: FormGroup;

  router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private voucherservice: VoucherService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {

    this.inItForm();

  }
  inItForm() {
    const userId = this.getCurrentUserId();

    this.createVoucherForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/) // Allow only letters and spaces
        ]],
      code: ['', [Validators.required]],
      creator_id: [userId, [Validators.required]],
      approval_id: [''],
      status: ['', [Validators.required]],
      discount_percentage: ['', [Validators.required]],
    });
  }
  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }

  onSubmit() {
    this.voucherservice
      .createVoucher(this.createVoucherForm.value)
      .subscribe((data: any) => {
        console.log(data);

        this.router.navigate(['/voucher']);

        this.snackBar.open('Voucher Created Successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });


      });
  }


}
