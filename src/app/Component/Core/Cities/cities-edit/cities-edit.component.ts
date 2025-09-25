import { Component, inject, OnInit } from '@angular/core';
import { CitiesService } from '../../../../Services/cities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { States } from '../../../../Models/States';
import { HttpParams } from '@angular/common/http';
import { StatesService } from '../../../../Services/states.service';
import { JsonPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-cities-edit',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './cities-edit.component.html',
  styleUrl: './cities-edit.component.css'
})
export class CitiesEditComponent implements OnInit {

  activatedoute = inject(ActivatedRoute);

  router = inject(Router);

  editCityForm!: FormGroup;

  states!: States[];

  cityId: any;

  constructor(private citiesService: CitiesService, private fb: FormBuilder, private stateService: StatesService) { }

  ngOnInit() {

    this.cityId = this.activatedoute.snapshot.paramMap.get('id');

    this.fetchCity();

    this.inItForm();

    this.fetchStates();

  }

  inItForm(){
    this.editCityForm = this.fb.group({
      name: [''],
      state_id: [''],
      country_id: ['']
    })
  }

  fetchCity(){
    // this.cityService.getCity(this.cityId).subscribe((response)=>{

    //   this.editCityForm.patchValue(response);
    // });


    this.citiesService.getCity(this.cityId).subscribe((response)=>{


        const formdata = {
           name: response.data.name,
           state_id: response.data.state.id
        }
        console.log(response, formdata);


      this.editCityForm.patchValue(formdata);
    });


  }

  onSubmit(){
    this.citiesService.updateCity(this.cityId, this.editCityForm.value).subscribe((response)=>{
      console.log(response);
      this.router.navigate(['/cities']);
    });
  }

  fetchStates(){
        const params = new HttpParams();

       this.stateService.getStates(params).subscribe((respsone:any)=>{
          this.states = respsone.data;
       });
    }

}

