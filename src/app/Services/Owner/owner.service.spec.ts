import { TestBed } from '@angular/core/testing';
import { OwnerService } from './owner.service';
import { ApiService } from '../api.service';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('OwnerService', () => {
  let service: OwnerService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'update','delete']);

    TestBed.configureTestingModule({
      providers: [
        OwnerService,
              { provide: ApiService, useValue: apiServiceSpy },
              provideHttpClient(),
            ]
    });
    service = TestBed.inject(OwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apiService.get with correct parameters when getOwners is called', () => {
    const queryParams = new HttpParams().set('name', 'John Doe');
    const expectedResponse = [{ id: 1, name: 'John Doe' }];

    // Mock the API response
    apiServiceSpy.get.and.returnValue(of(expectedResponse));

    service.getOwners(queryParams).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledOnceWith('owners', queryParams);
  });

  it('should call apiService.post with correct parameters when createOwner is called', () => {
    const newOwner = { name: 'John Doe', age: 35 };
    const expectedResponse = { id: 1, name: 'John Doe', age: 35 };

    // Mock the API response
    apiServiceSpy.post.and.returnValue(of(expectedResponse));

    service.createOwner(newOwner).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledOnceWith('owners', newOwner);
  });

  it('should call apiService.get with correct URL when getOwner is called', () => {
    const ownerId = 1;
    const expectedResponse = { id: 1, name: 'John Doe', age: 35 };

    // Mock the API response
    apiServiceSpy.get.and.returnValue(of(expectedResponse));

    service.getOwner(ownerId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledOnceWith(`owners/${ownerId}`);
  });

  it('should call apiService.update with correct URL and data when updateOwner is called', () => {
    const ownerId = 1;
    const updatedData = { name: 'Jane Doe', age: 40 };
    const expectedResponse = { id: 1, name: 'Jane Doe', age: 40 };

    // Mock the API response
    apiServiceSpy.update.and.returnValue(of(expectedResponse));

    service.updateOwner(ownerId, updatedData).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    expect(apiServiceSpy.update).toHaveBeenCalledOnceWith(`owners/${ownerId}`, updatedData);
  });

  it('should call apiService.delete with correct URL when deleteOwner is called', () => {
    const ownerId = 1;
    const expectedResponse = { message: 'Owner deleted successfully' };

    // Mock the API response
    apiServiceSpy.delete.and.returnValue(of(expectedResponse));

    service.deleteOwner(ownerId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledOnceWith(`owners/${ownerId}`);
  });

});
