import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CitiesService } from './cities.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

describe('CitiesService', () => {
  let service: CitiesService;
  let httpMock: HttpTestingController;

  const toastrMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning'),
    info: jasmine.createSpy('info'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CitiesService,
        { provide: ToastrService, useValue: toastrMock }
      ]
    });

    service = TestBed.inject(CitiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure all requests are handled
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cities list (mocked API call)', () => {
    const mockCities = [
      { id: 1, name: 'Mumbai' },
      { id: 2, name: 'New York' }
    ];

    const queryParams = new HttpParams();

    service.getCities(queryParams).subscribe((cities) => {
      expect(cities).toEqual(mockCities);
    });

    const req = httpMock.expectOne('http://localhost:9000/api/cities');
    expect(req.request.method).toBe('GET');
    req.flush(mockCities); // Simulate API response
  });
});
