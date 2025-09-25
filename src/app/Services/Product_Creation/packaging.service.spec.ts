import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

import { PackagingService } from './packaging.service';
import { ApiService } from '../api.service';

describe('PackagingService', () => {
  let service: PackagingService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [PackagingService, ApiService]
    });

    service = TestBed.inject(PackagingService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch packaging data', () => {
    const mockPackagings = [
      { id: 1, name: 'Box' },
      { id: 2, name: 'Bag' }
    ];

    service.getPackagings().subscribe(packages => {
      expect(packages).toEqual(mockPackagings);
    });

    const req = httpMock.expectOne('http://localhost:9000/api/packagings');
    expect(req.request.method).toBe('GET');
    req.flush(mockPackagings);
  });

  it('should create a new packaging', () => {
    const newPackaging = { name: 'New Box' };

    service.createPackaging(newPackaging).subscribe(response => {
      expect(response).toEqual(newPackaging);
    });

    const req = httpMock.expectOne('http://localhost:9000/api/packagings');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPackaging);
    req.flush(newPackaging);
  });

  it('should update a packaging', () => {
    const updatedPackaging = { id: 1, name: 'Updated Box' };

    service.updatePackaging(1, updatedPackaging).subscribe(response => {
      expect(response).toEqual(updatedPackaging);
    });

    const req = httpMock.expectOne('http://localhost:9000/api/packagings/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPackaging);
    req.flush(updatedPackaging);
  });

  it('should delete a packaging', () => {
    service.deletePackaging(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:9000/api/packagings/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
