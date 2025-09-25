import { StatesService } from './../../../../Services/states.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitiesService } from '../../../../Services/cities.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { States } from '../../../../Models/States';
import { HttpParams } from '@angular/common/http';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-cities-create',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './cities-create.component.html',
  styleUrl: './cities-create.component.css'
})
export class CitiesCreateComponent implements OnInit {

  createCityForm!: FormGroup;
  states!: States[];

  router= inject(Router);
  constructor(private fb: FormBuilder, private citiesService: CitiesService, private stateService: StatesService, private toastr: ToastrService) { }

  ngOnInit() {

    this.inItForm();

    this.fetchStates();
  }


  inItForm()
  {
    this.createCityForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern('^[A-Za-z]+$')]],
      state_id: [''],
      country_id: ['']
    });
  }
  
  onSubmit(): void {
    if (this.createCityForm.valid) {
      this.citiesService.createCity(this.createCityForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success('City created successfully');  // <-- this line is key!
          // maybe navigate or reset form here
        },
        error: () => {
          this.toastr.error('City creation failed');
        }
      });
    }
  }


  fetchStates(){
      const params = new HttpParams();

     this.stateService.getStates(params).subscribe((respsone:any)=>{
        this.states = respsone.data;
     });
  }
}

