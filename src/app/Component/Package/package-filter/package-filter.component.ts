import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';



@Component({
  selector: 'app-package-filter',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './package-filter.component.html',
  styleUrl: './package-filter.component.css'
})
export class PackageFilterComponent {

  packageFilterForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.packageFilterForm = this.fb.group({
      name: [''],
      status: [''],
    });
  }

  onSubmit() {
    this.router.navigate([], {
      queryParams: this.packageFilterForm.value,
      queryParamsHandling: 'merge'
    });

  }

  onReset() {
    this.packageFilterForm.reset({
      name: '',
      status: ''
    });

    this.router.navigate([], {
      queryParams: this.packageFilterForm.value,
      queryParamsHandling: 'merge'
    });
  }
}
