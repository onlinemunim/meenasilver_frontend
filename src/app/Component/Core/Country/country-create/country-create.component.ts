import { NgIf } from '@angular/common';
import { CountryService } from '../../../../Services/country.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-create',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './country-create.component.html',
  styleUrl: './country-create.component.css'
})
export class CountryCreateComponent implements OnInit {


  createCountryForm!: FormGroup;

  router= inject(Router);

  constructor(private fb:FormBuilder, private countryService:CountryService) { }

  ngOnInit() {

    this.inItForm();

  }

  inItForm()
  {
    this.createCountryForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern('^[A-Za-z]+$')]],
      code: [''],
      currency: ['',[Validators.required,Validators.pattern('^[A-Za-z]+$')]],
    });
  }

  onSubmit(){

    this.countryService.createCountry(this.createCountryForm.value).subscribe((data:any)=>{
      this.router.navigate(['/countries']);
    })
  }
}

