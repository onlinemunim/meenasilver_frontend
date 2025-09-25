import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PackageShowComponent } from './package-show.component';
import { NgFor } from '@angular/common';
import { RouterLink, provideRouter } from '@angular/router';
import { PackageService } from '../../../Services/Package/package.service';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

describe('PackageShowComponent', () => {
  let component: PackageShowComponent;
  let fixture: ComponentFixture<PackageShowComponent>;
  let packageServiceSpy: jasmine.SpyObj<PackageService>;

  beforeEach(async () => {
    packageServiceSpy = jasmine.createSpyObj('PackageService', ['getPackages', 'deletePackage']);

    await TestBed.configureTestingModule({
      imports: [PackageShowComponent, NgFor, RouterLink],  // Import standalone component here
      providers: [
        { provide: PackageService, useValue: packageServiceSpy },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageShowComponent);  // Corrected component here
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPackages and update packages', () => {
    const mockPackagesData = {
      data: [
        {
          id: 1,
          name: 'Basic Package',
          description: 'A basic package with essential features',
          components: [
            { id: 1, name: 'Component 1', price: 10 },
            { id: 2, name: 'Component 2', price: 100 },
          ],
          total_amount: 1000,
          creator_id: 1,
          approval_id: null,
          min_amount: 500,
          status: 'Active',
        },
      ],
    };

    packageServiceSpy.getPackages.and.returnValue(of(mockPackagesData));

    const queryParams = new HttpParams().set('page', '1');

    component.fetchPackages(queryParams);

    expect(packageServiceSpy.getPackages).toHaveBeenCalledWith(queryParams);
    expect(component.packages).toEqual(mockPackagesData.data);
  });

  it('should delete the package and remove it from the packages array on success', () => {
    const mockPackagesData = {
      data: [
        { id: 1, name: 'Basic Package', description: 'A basic package with essential features', components: [], total_amount: 1000, creator_id: 1, approval_id: null, min_amount: 500, status: 'Active' },
        { id: 2, name: 'Advanced Package', description: 'An advanced package with more features', components: [], total_amount: 2000, creator_id: 2, approval_id: null, min_amount: 1500, status: 'Active' },
      ],
    };

    packageServiceSpy.getPackages.and.returnValue(of(mockPackagesData));

    component.fetchPackages(new HttpParams());

    expect(component.packages.length).toBe(2);

    packageServiceSpy.deletePackage.and.returnValue(of({ success: true }));

    spyOn(window, 'confirm').and.returnValue(true);

    const event = new Event('click');
    component.deletePackage(event, 1);

    expect(packageServiceSpy.deletePackage).toHaveBeenCalledWith(1);
    expect(component.packages.length).toBe(1);
    expect(component.packages[0].id).toBe(2);  // Package with ID 1 should be removed
  });

  it('should show an alert and not remove the package from the list on failure', () => {
    const mockPackagesData = {
      data: [
        { id: 1, name: 'Basic Package', description: 'A basic package with essential features', components: [], total_amount: 1000, creator_id: 1, approval_id: null, min_amount: 500, status: 'Active' },
        { id: 2, name: 'Advanced Package', description: 'An advanced package with more features', components: [], total_amount: 2000, creator_id: 2, approval_id: null, min_amount: 1500, status: 'Active' },
      ],
    };

    packageServiceSpy.getPackages.and.returnValue(of(mockPackagesData));

    component.fetchPackages(new HttpParams());

    expect(component.packages.length).toBe(2);

    packageServiceSpy.deletePackage.and.returnValue(of({ success: false }));

    spyOn(window, 'confirm').and.returnValue(true);

    const event = new Event('click');
    component.deletePackage(event, 1);

    expect(packageServiceSpy.deletePackage).toHaveBeenCalledWith(1);

    expect(component.packages.length).toBe(2);
  });

  // Test case for opening the details drawer
  it('should open the details drawer with the selected package', () => {
    const mockPackage = {
      id: 1,
      name: 'Basic Package',
      description: 'A basic package',
      components: [],
      total_amount: 1000,
      creator_id: 1,
      approval_id: null,
      min_amount: 500,
      status: 'Active',
    };

    component.openDetailsDrawer(mockPackage);

    expect(component.selectedPackage).toEqual(mockPackage);
    expect(component.isDrawerOpen).toBeTrue();
  });

  // Test case for closing  drawer
  it('should close the details drawer and clear the selected package', () => {
    component.closeDetailsDrawer();

    expect(component.isDrawerOpen).toBeFalse();
    expect(component.selectedPackage).toBeNull();
  });
});
