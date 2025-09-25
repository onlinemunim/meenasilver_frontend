import { NgIf } from '@angular/common';
import { OwnerService } from './../../../Services/Owner/owner.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-owner-create',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './owner-create.component.html',
  styleUrl: './owner-create.component.css'
})
export class OwnerCreateComponent implements OnInit {

  createOwnerForm!: FormGroup;

  router= inject(Router);

  constructor(private fb:FormBuilder, private ownerService:OwnerService) { }

  ngOnInit() {

    this.inItForm();

  }

  inItForm()
  {
    this.createOwnerForm = this.fb.group({
      fname: ['',[Validators.required,Validators.pattern('^[A-Za-z]+$')]],
      lname: ['',[Validators.required,Validators.pattern('^[A-Za-z]+$')]],
      father_name: ['',[Validators.required,Validators.pattern('^[A-Za-z]+$')]],
      dob: ['',Validators.required],
      sex: ['',Validators.required],
      qualification: ['',[Validators.required,,Validators.pattern('^[A-Za-z]+$')]],
      phone: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      mobile: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      sec_mobile: ['',[Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      email: ['',[Validators.required,Validators.email]],
      website: ['',Validators.required],
      ecomm_website: ['',Validators.required],
      since: ['',Validators.required],
      ref: ['',Validators.required],
      act_contact: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$') ]],
      otp: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern('^[0-9]+$')]],
      other_info: ['',Validators.required],
      image_id: ['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      // thumb_check: ['',Validators.required],
      refferal_code: ['',Validators.required],
      last_column: ['',Validators.required],
    });
  }

  onSubmit() {
    this.ownerService.createOwner(this.createOwnerForm.value).subscribe(
      (data: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Owner created successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/owners']);
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create owner. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

}
