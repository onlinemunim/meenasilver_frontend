import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.css']
})
export class UserFilterComponent implements OnInit {
  
  userFilterForm!: FormGroup;

  userTypes: string[] = ['admin','developer','hr'];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userFilterForm = this.fb.group({
      name: [''],
      email: [''],
      userType: []
    });
  }

  onSubmit() {
    this.router.navigate([], {
      queryParams: this.userFilterForm.value,
      queryParamsHandling: 'merge'
    });

  }

  onReset() {
    this.userFilterForm.reset();

    this.router.navigate([], {
      queryParams: this.userFilterForm.value,
      queryParamsHandling: 'merge'
    });
  }
}
