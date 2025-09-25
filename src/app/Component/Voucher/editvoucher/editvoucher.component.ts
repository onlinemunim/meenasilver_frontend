import { Component, OnInit ,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { VoucherService } from '../../../Services/voucher.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editvoucher',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './editvoucher.component.html',
  styleUrl: './editvoucher.component.css'
})
export class EditvoucherComponent implements OnInit
{


  activatedroute = inject(ActivatedRoute);

  router = inject(Router);

  editVoucherForm!: FormGroup;

  voucherId: any;
  successMessage: any;

  constructor(private voucherService: VoucherService,private fb:FormBuilder){}

  ngOnInit() {

    this.voucherId = this.activatedroute.snapshot.params['id'];

    this.fetchVoucher();

    this.inItForm();
  }
  inItForm()
  {
    this.editVoucherForm =this.fb.group({
      name: [''],
      description: [''],
      code: ['',Validators.required],
      approval_id: [''],
      status: [''],
      discount_percentage: [''],
       })
  }

  fetchVoucher()
  {
    this.voucherService.getVoucher(this.voucherId).subscribe((response:any)=>
    {

      this.editVoucherForm.patchValue(response.data);

    })
  }

  onSubmit()
  {
    if (this.editVoucherForm.invalid) {
      this.showValidationErrors();
      return;
    }
    this.voucherService.updateVoucher(this.voucherId,this.editVoucherForm.value).subscribe((response)=>
    {
      console.log(response);
      this.successMessage = 'Voucher updated successfully!';
      if(typeof window !== 'undefined' && !(window as any)['__karma__'])
      {
       Swal.fire({
        title: 'Success!',
        text: this.successMessage,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(()=>
      {
        this.router.navigate(['/voucher']);
      });
    }
      else
      {
        this.router.navigate(['/voucher']);
      }
    });

  }
  showValidationErrors() {
    let errorMessages = [];

    if (this.editVoucherForm.controls['name'].hasError('required')) {
      errorMessages.push('Voucher Name is required');
    }
    if (this.editVoucherForm.controls['description'].hasError('required')) {
      errorMessages.push('Voucher Description is required');
    }
    if (this.editVoucherForm.controls['code'].hasError('required')) {
      errorMessages.push('Voucher Code is required');
    }
    if (this.editVoucherForm.controls['status'].hasError('required')) {
      errorMessages.push('Status is required');
    }
    if (this.editVoucherForm.controls['discount_percentage'].hasError('required')) {
      errorMessages.push('Discount Percentage is required');
    }

    Swal.fire({
      title: 'Validation Error!',
      html: errorMessages.join('<br>'),
      icon: 'error',
      confirmButtonText: 'OK'
    });


  }
}





