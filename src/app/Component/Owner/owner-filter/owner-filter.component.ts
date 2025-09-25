import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-owner-filter',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './owner-filter.component.html',
  styleUrl: './owner-filter.component.css'
})
export class OwnerFilterComponent implements OnInit{
  ownerFilterForm!: FormGroup;
  ownerType: string[] = [];
  constructor(private fb: FormBuilder,private router:Router){}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.ownerFilterForm = this.fb.group({
      id:[''],
      firstname:[''],
      lastname:[''],
      dateofbirth:[''],
      sexvalue:[''],
      mobilenumber:[''],
      mailid:[''],
      education:[''],
    });
  }

  onSubmit(){
    this.router.navigate([],{
      queryParams : this.ownerFilterForm.value,
      queryParamsHandling: 'merge'
    })
  }

  onReset(){
    this.ownerFilterForm.reset();

    this.router.navigate([],{
      queryParams: this.ownerFilterForm.value,
      queryParamsHandling: 'merge'
    })
  }
}
