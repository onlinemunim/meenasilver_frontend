import { TestBed } from '@angular/core/testing';
import { CountryService } from './country.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  const toastrMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
  };

  const notificationMock = {
    showSuccess: jasmine.createSpy('showSuccess'),
    showError: jasmine.createSpy('showError'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CountryService,
        ApiService,
        { provide: ToastrService, useValue: toastrMock },
        { provide: NotificationService, useValue: notificationMock }
      ]
    });

    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch country list (mocked API call)', () => {
    const mockCountries = [
      { id: 1, name: 'India', code: 'IN', currency: 'INR' },
      { id: 2, name: 'USA', code: 'US', currency: 'USD' }
    ];

    const queryParams = new HttpParams();

    service.getCountries(queryParams).subscribe((response) => {
      expect(response).toEqual(mockCountries);
    });

    const req = httpMock.expectOne('http://localhost:9000/api/countries');
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });
});
