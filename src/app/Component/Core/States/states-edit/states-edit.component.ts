import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatesService } from '../../../../Services/states.service';

@Component({
  selector: 'app-states-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './states-edit.component.html',
  styleUrls: ['./states-edit.component.css'] 
})
export class StatesEditComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  editStateForm!: FormGroup;
  stateForm!: FormGroup;
  stateId: number | null = null;

  constructor(private stateService: StatesService, private fb: FormBuilder) {

    this.stateForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('ID from route:', id); // Debugging


    this.stateId = id ? parseInt(id, 10) : null;

    this.inItForm();

    if (this.stateId !== null) {
      this.fetchState();
    }
  }

  inItForm() {
    this.editStateForm = this.fb.group({
      name: ['', Validators.required],
      country_id: ['', Validators.required]
    });
  }

  fetchState() {
    if (this.stateId !== null) {
      this.stateService.getState(this.stateId).subscribe((response) => {
        console.log('State Data:', response);


        if (response && response.data) {
          this.editStateForm.patchValue(response.data);
        }
      });
    }
  }

  onSubmit() {
    if (this.editStateForm.valid && this.stateId !== null) {
      this.stateService.updateState(this.stateId, this.editStateForm.value).subscribe((response) => {
        console.log('Update Response:', response);
        this.router.navigate(['/states']);
      });
    }
  }

}
