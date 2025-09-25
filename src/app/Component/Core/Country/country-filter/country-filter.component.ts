import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-country-filter',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './country-filter.component.html',
  styleUrls: ['./country-filter.component.css']
})
export class CountryFilterComponent implements OnInit {
  countryFilterForm!: FormGroup;

  userTypes: string[] = ['admin','developer','hr'];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.countryFilterForm = this.fb.group({
      name: [''],
      code: [''],
      currency: [''],
      id:['']
    });
  }

  onSubmit() {
    this.router.navigate([], {
      queryParams: this.countryFilterForm.value,
      queryParamsHandling: 'merge'
    });

  }

  onReset() {
    this.countryFilterForm.reset();

    this.router.navigate([], {
      queryParams: this.countryFilterForm.value,
      queryParamsHandling: 'merge'
    });
  }
}

