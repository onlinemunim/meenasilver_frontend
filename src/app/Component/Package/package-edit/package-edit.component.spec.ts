import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageEditComponent } from './package-edit.component';
import { PackageService } from '../../../Services/Package/package.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('PackageEditComponent', () => {
  let component: PackageEditComponent;
  let fixture: ComponentFixture<PackageEditComponent>;
  let packageServiceSpy: jasmine.SpyObj<PackageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    packageServiceSpy = jasmine.createSpyObj('PackageService', ['getPackage', 'updatePackage']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const activatedRouteMock = {
      snapshot: { params: { id: '123' } }
    };

    packageServiceSpy.getPackage.and.returnValue(of({
      data: {
        name: 'Basic Package',
        description: 'A basic package with essential features',
        components: [
          { id: 1, name: 'Component 1', price: 10 },
          { id: 2, name: 'Component 2', price: 100 }
        ],
        total_amount: 1000,
        creator_id: 1,
        approval_id: null,
        min_amount: 500,
        status: 'Active',
      }
    }));

    packageServiceSpy.updatePackage.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PackageEditComponent],
      providers: [
        FormBuilder,
        { provide: PackageService, useValue: packageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with package data on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.editPackageForm).toBeDefined();
    expect(component.editPackageForm.controls['name']).toBeDefined();
    expect(component.editPackageForm.controls['description']).toBeDefined();
    expect(component.editPackageForm.controls['components']).toBeDefined();
    expect(component.editPackageForm.controls['total_amount']).toBeDefined();
    expect(component.editPackageForm.controls['min_amount']).toBeDefined();
    expect(component.editPackageForm.controls['status']).toBeDefined();
    expect(component.editPackageForm.controls['creator_id']).toBeDefined();

    expect(component.editPackageForm.get('name')?.value).toBe('Basic Package');
    expect(component.editPackageForm.get('description')?.value).toBe('A basic package with essential features');
    expect(component.editPackageForm.get('components')?.value).toEqual([
      { name: 'Component 1', price: 10 },
      { name: 'Component 2', price: 100 }
    ]);
    expect(component.editPackageForm.get('total_amount')?.value).toBe(1000);
    expect(component.editPackageForm.get('min_amount')?.value).toBe(500);
    expect(component.editPackageForm.get('status')?.value).toBe('Active');
    expect(component.editPackageForm.get('creator_id')?.value).toBe('');
  });

  it('should call updatePackage and navigate on valid form submit', () => {
    const updatedPackage = {
      name: 'Updated Package',
      description: 'Updated package description',
      components: [{ name: 'Component 1', price: 10 }],
      total_amount: 1200,
      min_amount: 600,
      status: 'Inactive',
      creator_id: 1
    };

    component.components.clear();
    updatedPackage.components.forEach(comp => {
      component.components.push(component['fb'].group({
        name: [comp.name],
        price: [comp.price]
      }));
    });

    component.editPackageForm.patchValue({
      name: updatedPackage.name,
      description: updatedPackage.description,
      total_amount: updatedPackage.total_amount,
      min_amount: updatedPackage.min_amount,
      status: updatedPackage.status,
      creator_id: updatedPackage.creator_id
    });

    component.onSubmit();

    expect(packageServiceSpy.updatePackage).toHaveBeenCalledWith('123', {
      ...updatedPackage,
      components: component.components.value
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/packages']);
  });

  it('should show an error message when update fails', () => {
    packageServiceSpy.updatePackage.and.returnValue(of({ success: false }));

    const updatedPackage = {
      name: 'Updated Package',
      description: 'Updated package description',
      components: [{ name: 'Component 1', price: 10 }],
      total_amount: 1200,
      min_amount: 600,
      status: 'Inactive',
      creator_id: 1
    };

    component.components.clear();
    updatedPackage.components.forEach(comp => {
      component.components.push(component['fb'].group({
        name: [comp.name],
        price: [comp.price]
      }));
    });

    component.editPackageForm.patchValue({
      name: updatedPackage.name,
      description: updatedPackage.description,
      total_amount: updatedPackage.total_amount,
      min_amount: updatedPackage.min_amount,
      status: updatedPackage.status,
      creator_id: updatedPackage.creator_id
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Failed to update package');
  });

  it('should not submit form if form is invalid', () => {
    const updatedPackage = {
      name: '', // Invalid
      description: 'Updated package description',
      components: [{ name: 'Component 1', price: 10 }],
      total_amount: 1200,
      min_amount: 600,
      status: 'Inactive',
      creator_id: 1
    };

    component.components.clear();
    updatedPackage.components.forEach(comp => {
      component.components.push(component['fb'].group({
        name: [comp.name],
        price: [comp.price]
      }));
    });

    component.editPackageForm.patchValue({
      name: updatedPackage.name,
      description: updatedPackage.description,
      total_amount: updatedPackage.total_amount,
      min_amount: updatedPackage.min_amount,
      status: updatedPackage.status,
      creator_id: updatedPackage.creator_id
    });

    component.onSubmit();

    expect(packageServiceSpy.updatePackage).not.toHaveBeenCalled();
  });

});
