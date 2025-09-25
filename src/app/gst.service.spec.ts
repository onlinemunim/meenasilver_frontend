import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GstService } from './gst.service';
import { ApiService } from './Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';  // Import HttpParams for the test
import { of } from 'rxjs';

// Mock of ToastrService
class MockToastrService {
  success() { }
  error() { }
  info() { }
  warning() { }
}

describe('GstService', () => {
  let httpMock: HttpTestingController;
  let service: GstService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        GstService,
        { provide: ToastrService, useClass: MockToastrService }
      ],
    });

    service = TestBed.inject(GstService);
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make an HTTP GET request and return data', () => {
    const gstNumber = '09AAACH7409R1ZZ';
    const mockResponse = { gst_info: 'Some mock data' }; // Mocked response

    service.getGstDetails(gstNumber).subscribe(response => {
      expect(response).toEqual(mockResponse);  // Ensure response is as expected
    });

    const req = httpMock.expectOne('http://localhost:9000/api/get-gst-info?gst_number=09AAACH7409R1ZZ');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('gst_number')).toBe(gstNumber);

    req.flush(mockResponse);
  });


});
