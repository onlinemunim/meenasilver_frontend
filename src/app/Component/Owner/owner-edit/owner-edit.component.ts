import { Component, inject, OnInit } from '@angular/core';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-owner-edit',
  imports: [ ReactiveFormsModule,NgIf],
  templateUrl: './owner-edit.component.html',
  styleUrl: './owner-edit.component.css'
})
export class OwnerEditComponent  implements OnInit{

  activateroute = inject(ActivatedRoute);

  router = inject(Router);

  editOwnerForm!: FormGroup;

  ownerId: any;

  constructor(private ownerService: OwnerService, private fb: FormBuilder) { }

  ngOnInit() {

    this.ownerId = this.activateroute.snapshot.params['id'];

    this.fetchOwner();

    this.inItForm();

  }

  inItForm(){
    this.editOwnerForm = this.fb.group({
      fname: ['',[Validators.required,Validators.pattern('^[A-Za-z ]+$')]],
      lname: ['',[Validators.required,Validators.pattern('^[A-Za-z ]+$')]],
      father_name: ['',[Validators.required,Validators.pattern('^[A-Za-z ]+$')]],
      dob: ['',Validators.required],
      sex: ['',Validators.required],
      qualification: ['',[Validators.required,Validators.pattern('^[A-Za-z ]+$')]],
      phone: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      mobile: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      sec_mobile: ['',[Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      email: ['',[Validators.required,Validators.email]],
      website: ['',Validators.required],
      ecomm_website: ['',Validators.required],
      act_contact: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(15),Validators.pattern('^[0-9]+$')]],
      other_info: ['',Validators.required],
      last_column: ['',Validators.required],
    })
  }

  fetchOwner(){
    this.ownerService.getOwner(this.ownerId).subscribe((resposne)=>{

      this.editOwnerForm.patchValue(resposne.data);
    });
  }

  onSubmit() {
    this.ownerService.updateOwner(this.ownerId, this.editOwnerForm.value).subscribe(
      (response) => {
        console.log(response);

        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'Owner updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Navigate after closing the alert
          this.router.navigate(['/owners']);
        });
      },
      (error) => {
        console.error(error);

        // Show error alert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update owner.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    );
  }

}
