// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { PackageCreateComponent } from './package-create.component';
// import { PackageService } from '../../../Services/Package/package.service';
// import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
// import { provideRouter, Router } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { of } from 'rxjs';

// describe('PackageCreateComponent', () => {
//   let component: PackageCreateComponent;
//   let fixture: ComponentFixture<PackageCreateComponent>;
//   let packageServiceSpy: jasmine.SpyObj<PackageService>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     packageServiceSpy = jasmine.createSpyObj('PackageService', ['createPackage']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       imports: [
//         ReactiveFormsModule,  // Import ReactiveFormsModule for FormGroup, FormControl, and FormArray
//       ],
//       providers: [
//         FormBuilder,
//         { provide: PackageService, useValue: packageServiceSpy },
//         { provide: Router, useValue: routerSpy },
//         provideHttpClient(),
//         provideRouter([]),
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(PackageCreateComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize the form on component init', () => {
//     expect(component.createPackageForm).toBeDefined();
//     expect(component.createPackageForm.controls['name']).toBeDefined();
//     expect(component.createPackageForm.controls['description']).toBeDefined();
//     expect(component.createPackageForm.controls['status']).toBeDefined();
//     expect(component.createPackageForm.controls['min_amount']).toBeDefined();
//     expect(component.createPackageForm.controls['components']).toBeDefined();
//   });

//   it('should initialize components array with one empty component form group', () => {
//     // Ensure the component form array is properly initialized with one empty component form group
//     const componentFormGroup = component.createPackageForm.get('components') as FormArray;
//     expect(componentFormGroup.length).toBe(1);
//     const firstComponent = componentFormGroup.at(0) as FormGroup;
//     expect(firstComponent.controls['name']).toBeDefined();
//     expect(firstComponent.controls['price']).toBeDefined();
//   });

//   it('should add a component form group when "Add Component" button is clicked', () => {
//     component.addComponet();
//     fixture.detectChanges();

//     const componentFormGroup = component.createPackageForm.get('components') as FormArray;
//     expect(componentFormGroup.length).toBe(2);
//     const secondComponent = componentFormGroup.at(1) as FormGroup;
//     expect(secondComponent.controls['name']).toBeDefined();
//     expect(secondComponent.controls['price']).toBeDefined();
//   });

//   it('should remove a component form group when "Remove" button is clicked', () => {
//     component.addComponet();
//     fixture.detectChanges();

//     const componentFormGroup = component.createPackageForm.get('components') as FormArray;
//     expect(componentFormGroup.length).toBe(2);

//     component.removeComponent(1);
//     fixture.detectChanges();

//     expect(componentFormGroup.length).toBe(1);
//   });

//   it('should call createPackage on form submission', () => {
//     const mockPackage = {
//       name: 'Package Name',
//       description: 'Package description',
//       status: 'active',
//       min_amount: 10,
//       components: [{ name: 'Component 1', price: 20 }]
//     };
//     packageServiceSpy.createPackage.and.returnValue(of({ success: true }));

//     component.createPackageForm.setValue(mockPackage);
//     component.onSubmit();

//     expect(packageServiceSpy.createPackage).toHaveBeenCalledWith(mockPackage);
//   });

//   it('should navigate to "/packages" after successful package creation', () => {
//     const mockPackage = {
//       name: 'Package Name',
//       description: 'Package description',
//       status: 'active',
//       min_amount: 10,
//       components: [{ name: 'Component 1', price: 20 }]
//     };
//     packageServiceSpy.createPackage.and.returnValue(of({ success: true }));

//     component.createPackageForm.setValue(mockPackage);
//     component.onSubmit();

//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/packages']);
//   });

//   it('should not call createPackage if the form is invalid', () => {
//     const mockPackage = {
//       name: '',  // Invalid name
//       description: 'Package description',
//       status: 'active',
//       min_amount: 10,
//       components: [{ name: 'Component 1', price: 20 }]
//     };

//     component.createPackageForm.setValue(mockPackage);
//     component.onSubmit();

//     expect(packageServiceSpy.createPackage).not.toHaveBeenCalled();
//   });
// });
