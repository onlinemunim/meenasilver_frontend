import { state } from '@angular/animations';
import { StatesService } from '../../../../Services/states.service';
import { CountryService } from './../../../../Services/country.service';
import { CitiesService } from './../../../../Services/cities.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-cities-filter',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatSelectModule, NgForOf],
  templateUrl: './cities-filter.component.html',
  styleUrl: './cities-filter.component.css'
})
export class CitiesFilterComponent implements OnInit {
  CityFilterForm!: FormGroup;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];

  userTypes: string[] = ['admin','developer','hr'];

  constructor(private fb: FormBuilder, private router: Router, private countryService: CountryService, private statesService: StatesService, private citiesService:CitiesService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();
    this.loadStates();
    this.loadCities();
  }

  initForm() {
    this.CityFilterForm = this.fb.group({
      name: [''],
      id: [''],
      country_name: [''],
      state_name: [''],

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
  loadCities() {
    this.citiesService.getAllCities().subscribe((response: any) => {
      this.cities = response.data.map((city: any) => city.name);
    });
  }

  onSubmit() {
    this.router.navigate([], {
      queryParams: this.CityFilterForm.value,
      queryParamsHandling: 'merge'
    });

  }

  onReset() {
    this.CityFilterForm.reset();

    this.router.navigate([], {
      queryParams: this.CityFilterForm.value,
      queryParamsHandling: 'merge'
    });
  }
}