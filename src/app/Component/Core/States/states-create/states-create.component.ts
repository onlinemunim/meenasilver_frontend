import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatesService } from '../../../../Services/states.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-states-create',
  imports: [ReactiveFormsModule],
  templateUrl: './states-create.component.html',
  styleUrl: './states-create.component.css'
})
export class StatesCreateComponent implements OnInit {

  createStateForm!: FormGroup;

  router= inject(Router);

  constructor(private fb:FormBuilder, private stateService:StatesService) { }

  ngOnInit() {

    this.inItForm();

  }

  inItForm()
  {
    this.createStateForm = this.fb.group({
      name: [''],
      country_id: [''],
    });
  }

  onSubmit(){
    this.stateService.createState(this.createStateForm.value).subscribe((data:any)=>{
      this.router.navigate(['/states']);
    })
  }
}

