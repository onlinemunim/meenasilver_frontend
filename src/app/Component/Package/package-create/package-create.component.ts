import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { PackageService } from '../../../Services/Package/package.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-package-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './package-create.component.html',
  styleUrl: './package-create.component.css'
})
export class PackageCreateComponent implements OnInit {

  createPackageForm!: FormGroup;

  router = inject(Router);

  constructor(private fb: FormBuilder, private packageService: PackageService) {}

  ngOnInit() {
    this.initForm();
  }

  get components(): FormArray {
    return this.createPackageForm.get('components') as FormArray;
  }

  initForm() {
    this.createPackageForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z\\s]+$')
      ]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      components: this.fb.array([
        this.initComponentForm()
      ]),
      status: ['', [Validators.required]],
      min_amount: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')  // Ensure it's a valid number (e.g., 10.00)
      ]]
    });
  }

  initComponentForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]]
    });
  }

  onSubmit() {
    if (this.createPackageForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    console.log(this.createPackageForm.value);

    this.packageService.createPackage(this.createPackageForm.value).subscribe(
      (data: any) => {
        console.log('Package created successfully', data);
        this.router.navigate(['/packages']);
      },
      (error) => {
        console.error('Error creating package', error);
      }
    );
  }

  addComponent() {
    this.components.push(this.initComponentForm());
  }

  removeComponent(index: number) {
    this.components.removeAt(index);
  }
}
