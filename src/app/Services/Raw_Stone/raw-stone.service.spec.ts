import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RawStoneService } from './raw-stone.service';
import { environment } from '../../../environments/environment';

describe('RawStoneService', () => {
  let service: RawStoneService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RawStoneService]
    });
    service = TestBed.inject(RawStoneService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get raw stone entry ID', () => {
    const testId = 123;
    service.setRawStoneEntryId(testId);
    service.rawStoneEntryId$.subscribe(id => {
      expect(id).toBe(testId);
    });
    expect(service.getRawStoneEntryId()).toBe(testId);
  });

  it('should set and get created raw stone entry', () => {
    const testEntry = { id: 1, name: 'Test Stone' };
    service.setCreatedRawStoneEntry(testEntry);
    expect(service.getCreatedRawStoneEntry()).toEqual(testEntry);
  });

  it('should send a POST request to create a raw stone entry', () => {
    const dummyFormData = new FormData();
    dummyFormData.append('st_category', 'Stone');
    dummyFormData.append('st_name', 'Diamond');
    const mockResponse = { message: 'Stone entry created', id: 1 };

    service.createRawStoneEntry(dummyFormData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}stocks`);
    expect(req.request.method).toBe('POST');
    // For FormData, you usually check the body indirectly or not at all,
    // as FormData itself is a complex object.
    req.flush(mockResponse);
  });

  it('should send a GET request to get raw stone entries', () => {
    const mockEntries = [{ id: 1, name: 'Ruby' }, { id: 2, name: 'Emerald' }];

    service.getRawStoneEntries().subscribe(entries => {
      expect(entries).toEqual(mockEntries);
    });

    const req = httpTestingController.expectOne(`${apiUrl}stocks?st_category=Stone`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEntries);
  });

  it('should send a GET request to get a raw stone entry by ID', () => {
    const testId = 1;
    const mockEntry = { id: 1, name: 'Sapphire' };

    service.getRawStoneEntryById(testId).subscribe(entry => {
      expect(entry).toEqual(mockEntry);
    });

    const req = httpTestingController.expectOne(`${apiUrl}stocks/${testId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEntry);
  });

  it('should send a POST request with X-HTTP-Method-Override for updating a raw stone entry', () => {
    const testId = '1';
    const dummyFormData = new FormData();
    dummyFormData.append('st_category', 'Stone');
    dummyFormData.append('st_name', 'Updated Diamond');
    const mockResponse = { message: 'Stone entry updated' };

    // Mock localStorage.getItem for the token
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.updateRawStoneEntry(testId, dummyFormData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}stocks/${testId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-HTTP-Method-Override')).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });

  it('should send a DELETE request to delete a raw stone entry', () => {
    const testId = 1;
    const mockResponse = { message: 'Stone entry deleted' };

    service.deleteRawStoneEntry(testId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}stocks/${testId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
