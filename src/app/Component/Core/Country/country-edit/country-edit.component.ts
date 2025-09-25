import { Component, inject, OnInit } from '@angular/core';
import { CountryService } from '../../../../Services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-country-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './country-edit.component.html',
  styleUrl: './country-edit.component.css'
})
export class CountryEditComponent implements OnInit {


  activatedoute = inject(ActivatedRoute);

  router = inject(Router);

  editCountryForm!: FormGroup;

  countryId: any;

  constructor(private countryService: CountryService, private fb: FormBuilder) { }

  // ngOnInit() {

  //   this.countryId = this.activatedoute.snapshot.params['id'];

  //   this.fetchCountry();

  //   this.inItForm();

  // }
  ngOnInit() {
    this.countryId = Number(this.activatedoute.snapshot.params['id']); // Ensure it's a number
    this.inItForm();
    this.fetchCountry();
  }


  inItForm(){
    this.editCountryForm = this.fb.group({
      name: [''],
      code: [''],
      currency: [''],
    })
  }

  fetchCountry(){
    this.countryService.getCountry(this.countryId).subscribe((response)=>{

      this.editCountryForm.patchValue(response.data);
    });
  }


  onSubmit(){
    this.countryService.updateCountry(this.countryId, this.editCountryForm.value).subscribe((response)=>{
      console.log(response);
      this.router.navigate(['/countries']);
    });
  }

}

