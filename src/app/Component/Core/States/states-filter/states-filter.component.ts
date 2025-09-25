import { StatesService } from '../../../../Services/states.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CountryService } from '../../../../Services/country.service';

@Component({
  selector: 'app-states-filter',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatSelectModule,NgForOf],
  templateUrl: './states-filter.component.html',
  styleUrl: './states-filter.component.css'
})
export class StatesFilterComponent implements OnInit {
  stateFilterForm!: FormGroup;
  countries: string[] = [];
  states: string[] = [];

  userTypes: string[] = ['admin','developer','hr'];

  constructor(private fb: FormBuilder, private router: Router, private countryService: CountryService, private statesService:StatesService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();
    this.loadStates();
  }

  initForm() {
    this.stateFilterForm = this.fb.group({
      name: [''],
      id: [''],
      country_name: [''],
      state_name:['']
    });
  }
  loadCountries() {
    this.countryService.getAllCountries().subscribe((response: any) => {
      this.countries = response.data.map((country: any) => country.name);
    });
  }
  loadStates() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.states = response.data.map((state: any) => state.name);
    });
  }


  onSubmit() {
    this.router.navigate([], {
      queryParams: this.stateFilterForm.value,
      queryParamsHandling: 'merge'
    });

  }

  onReset() {
    this.stateFilterForm.reset();

    this.router.navigate([], {
      queryParams: this.stateFilterForm.value,
      queryParamsHandling: 'merge'
    });
  }
}


