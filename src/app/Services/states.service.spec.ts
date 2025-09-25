import { TestBed } from '@angular/core/testing';
import { StatesService } from './states.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

describe('StatesService', () => {
  let service: StatesService;
  let httpMock: HttpTestingController;

  // ✅ Mock ToastrService to avoid dependency errors
  const toastrServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning'),
    info: jasmine.createSpy('info'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ Add HttpClientTestingModule
      providers: [
        StatesService,
        { provide: ToastrService, useValue: toastrServiceMock } // ✅ Mock ToastrService
      ]
    });

    service = TestBed.inject(StatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ✅ Ensures no pending HTTP requests after tests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch states list (mocked API call)', () => {
    const mockStates = [
      { id: 1, name: 'California' },
      { id: 2, name: 'Texas' }
    ];

    const queryParams = new HttpParams(); // Provide an empty HttpParams instance or customize as needed
    service.getStates(queryParams).subscribe((states) => {
      expect(states).toEqual(mockStates);
    });

    const req = httpMock.expectOne('http://localhost:9000/api/states');
    expect(req.request.method).toBe('GET');
    req.flush(mockStates); // ✅ Simulate API response
  });
});//
