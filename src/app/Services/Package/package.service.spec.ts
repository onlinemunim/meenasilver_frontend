import { TestBed } from '@angular/core/testing';
import { PackageService } from './package.service';
import { ApiService } from '../api.service';
import { HttpParams , provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';


describe('PackageService', () => {
  let service: PackageService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService',['get' , 'post' , 'update' , 'delete'])
    TestBed.configureTestingModule({
      providers:[
        PackageService,
        {provide: ApiService , useValue:apiServiceSpy},
        provideHttpClient(),
      ]
    });

    service = TestBed.inject(PackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call getPackages and return data', () => {
    // Arrange: Mock the response from apiService.get
    const mockPackagesData = {
      data: [
        { id: 1, name: 'Basic Package', description: 'A basic package' },
        { id: 2, name: 'Premium Package', description: 'A premium package' },
      ],
    };
    const queryParams = new HttpParams().set('page', '1');

    apiServiceSpy.get.and.returnValue(of(mockPackagesData));

    service.getPackages(queryParams).subscribe((response) => {
      expect(apiServiceSpy.get).toHaveBeenCalledWith('packages', queryParams);

      expect(response).toEqual(mockPackagesData);
    });
  });


  it('should call getPackage and return data', () => {
    const mockPackageData = {
      id: 1,
      name: 'Basic Package',
      description: 'A basic package with essential features',
      total_amount: 1000,
    };

    const packageId = 1;
    apiServiceSpy.get.and.returnValue(of(mockPackageData));

    service.getPackage(packageId).subscribe((response) => {
      expect(apiServiceSpy.get).toHaveBeenCalledWith('packages/' + packageId);

      expect(response).toEqual(mockPackageData);
    });
  });

  it('should call createPackage and return data', () => {
    const mockResponse = { success: true, id: 1, name: 'New Package' };
    const packageData = { name: 'New Package', description: 'A new package' };

    apiServiceSpy.post.and.returnValue(of(mockResponse));

    service.createPackage(packageData).subscribe((response) => {
      expect(apiServiceSpy.post).toHaveBeenCalledWith('packages', packageData);

      expect(response).toEqual(mockResponse);
    });
  });


  it('should call updatePackage and return data', () => {
    const mockResponse = { success: true, id: 1, name: 'Updated Package' };
    const packageId = 1;
    const updatedData = { name: 'Updated Package', description: 'An updated package' };

    apiServiceSpy.update.and.returnValue(of(mockResponse));

    service.updatePackage(packageId, updatedData).subscribe((response) => {
      expect(apiServiceSpy.update).toHaveBeenCalledWith('packages/' + packageId, updatedData);

      expect(response).toEqual(mockResponse);
    });
  });

  it('should call deletePackage and return data', () => {
    const mockResponse = { success: true };
    const packageId = 1;

    apiServiceSpy.delete.and.returnValue(of(mockResponse));

    service.deletePackage(packageId).subscribe((response) => {
      expect(apiServiceSpy.delete).toHaveBeenCalledWith('packages/' + packageId);

      expect(response).toEqual(mockResponse);
    });
  });


  it('should handle error correctly', () => {
    const errorResponse = { message: 'Error fetching packages' };
    const queryParams = new HttpParams().set('page', '1');

    apiServiceSpy.get.and.returnValue(of(errorResponse));

    service.getPackages(queryParams).subscribe({
      next: () => {},
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });
  });
});
