import { Component, inject, OnInit } from '@angular/core';
import { PackageService } from '../../../Services/Package/package.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-package-edit',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.css'],
})
export class PackageEditComponent implements OnInit {
  editPackageForm!: FormGroup;
  packageId: any;
  errorMessage: string = '';
  currentUserId: any = '';
  componentsValue: string = '';

  // Use Angular inject API for ActivatedRoute if desired
  activatedRoute = inject(ActivatedRoute);

  constructor(
    private packageService: PackageService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  get components(): FormArray {
    return this.editPackageForm.get('components') as FormArray;
  }

  ngOnInit(): void {
    this.packageId = this.activatedRoute.snapshot.params['id'];
    this.initForm();
    this.fetchPackage();
  }

  initForm() {
    this.editPackageForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      components: this.fb.array([]),
      total_amount: ['', [Validators.required]],
      min_amount: ['', [Validators.required]],
      status: ['', [Validators.required]],
      creator_id: [this.currentUserId],
    });
  }

  fetchPackage() {
    this.packageService.getPackage(this.packageId).subscribe(
      (response) => {
        const packageData = response.data;

        if (Array.isArray(packageData.components)) {
          packageData.components.forEach((component: any) => {
            this.components.push(this.initComponentForm(component));
          });
        }

        this.editPackageForm.patchValue({
          name: packageData.name,
          description: packageData.description,
          total_amount: packageData.total_amount,
          min_amount: packageData.min_amount,
          status: packageData.status,
          creator_id: this.currentUserId,
        });
      },
      (error) => {
        console.error('Error fetching package data:', error);
        this.errorMessage = 'Failed to load package data';
      }
    );
  }

  initComponentForm(component: any): FormGroup {
    return this.fb.group({
      name: [component.name, Validators.required],
      price: [component.price, Validators.required],
    });
  }

  removeComponent(index: number): void {
    this.components.removeAt(index);
  }

  onSubmit() {
    if (this.editPackageForm.invalid) {
      return;
    }

    const updatedPackage = this.editPackageForm.value;

    this.packageService.updatePackage(this.packageId, updatedPackage).subscribe(
      (response) => {
        if (response.success) {
          this.router.navigate(['/packages']);
        } else {
          this.errorMessage = 'Failed to update package';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to update package';
      }
    );
  }
}
