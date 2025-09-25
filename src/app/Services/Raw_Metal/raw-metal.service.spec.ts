import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RawMetalService } from './raw-metal.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api.service';
import { NotificationService } from '../notification.service';
import { of } from 'rxjs';

describe('RawMetalService', () => {
  let service: RawMetalService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiBaseUrl;

  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showInfo',
      'showWarning',
      'showDefault',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RawMetalService,
        { provide: ApiService, useValue: mockApiService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    service = TestBed.inject(RawMetalService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all raw metal entries (stocks)', () => {
    const mockEntries = [{ id: 1, metal: 'Gold' }, { id: 2, metal: 'Silver' }];

    mockApiService.get.and.returnValue(of(mockEntries));

    service.getRawMetalEntries().subscribe((entries) => {
      expect(entries).toEqual(mockEntries);
    });

    expect(mockApiService.get).toHaveBeenCalledWith('stocks'); // Updated endpoint
  });

  it('should set and get the raw metal entry ID', () => {
    const testId = 123;
    service.setRawMetalEntryId(testId);
    expect(service.getRawMetalEntryId()).toBe(testId);
  });

  it('should delete a raw metal entry (stock)', () => {
    const entryId = 1;
    const mockResponse = { message: 'Entry deleted' };

    mockApiService.delete.and.returnValue(of(mockResponse));

    service.deleteRawMetalEntry(entryId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    expect(mockApiService.delete).toHaveBeenCalledWith('stocks/' + entryId); // Updated endpoint
  });

  it('should retrieve a single raw metal entry (stock) by ID', () => {
    const entryId = 1;
    const mockEntry = { id: 1, code: 'RM001', metal: 'Gold' };

    mockApiService.get.and.returnValue(of(mockEntry));

    service.getRawMetalEntryById(entryId).subscribe((entry) => {
      expect(entry).toEqual(mockEntry);
    });

    expect(mockApiService.get).toHaveBeenCalledWith('stocks/' + entryId); // Updated endpoint
  });

  it('should update an existing raw metal entry (stock)', () => {
    const entryId = '1';
    const updatedEntryData = new FormData();
    updatedEntryData.append('code', 'RM001-Updated');
    updatedEntryData.append('metal', 'Silver');
    const mockFile = new File([''], 'updated.png', { type: 'image/png' });
    updatedEntryData.append('photo1', mockFile, mockFile.name);

    const mockResponse = { message: 'Entry updated successfully' };

    service.updateRawMetalEntry(entryId, updatedEntryData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}stocks/${entryId}`); // Updated endpoint
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-HTTP-Method-Override')).toBe('PUT');

    req.flush(mockResponse);
  });

  it('should set and get the created raw metal entry', () => {
    const createdEntry = { id: 5, code: 'NEW005', metal: 'Platinum' };
    service.setCreatedRawMetalEntry(createdEntry);
    expect(service.getCreatedRawMetalEntry()).toEqual(createdEntry);
  });

  it('should search raw metal entries (stocks) by metal type (`st_metal_type`)', () => {
    const query = 'Silver';
    const mockResults = [{ id: 2, metal: 'Silver' }];

    mockApiService.get.and.returnValue(of(mockResults));

    service.searchMetals(query).subscribe((results) => {
      expect(results).toEqual(mockResults);
    });

    // Updated endpoint and query parameter
    expect(mockApiService.get).toHaveBeenCalledWith(`stocks?st_metal_type=${query}`);
  });

  it('should search raw metal entries (stocks) by name (`st_name`)', () => {
    const query = 'Ring';
    const mockResults = [{ id: 1, name: 'Ring' }];

    mockApiService.get.and.returnValue(of(mockResults));

    service.searchNames(query).subscribe((results) => {
      expect(results).toEqual(mockResults);
    });

    // Updated endpoint and query parameter
    expect(mockApiService.get).toHaveBeenCalledWith(`stocks?st_name=${query}`);
  });

  it('should search raw metal entries (stocks) by code (`st_code`)', () => {
    const query = 'XYZ123';
    const mockResults = [{ id: 3, code: 'XYZ123' }];

    mockApiService.get.and.returnValue(of(mockResults));

    service.searchCodes(query).subscribe((results) => {
      expect(results).toEqual(mockResults);
    });

    // Updated endpoint and query parameter
    expect(mockApiService.get).toHaveBeenCalledWith(`stocks?st_code=${query}`);
  });

  it('should retrieve unique metal types from stocks', () => {
    const mockUniqueMetals = ['Gold', 'Silver', 'Platinum'];

    mockApiService.get.and.returnValue(of(mockUniqueMetals));

    service.getUniqueMetalTypes().subscribe((metals) => {
      expect(metals).toEqual(mockUniqueMetals);
    });

    expect(mockApiService.get).toHaveBeenCalledWith('stocks/unique-metals'); // Updated endpoint
  });

  it('should retrieve unique sizes from stocks', () => {
    const mockUniqueSizes = [10.5, 12.0, 15.2];

    mockApiService.get.and.returnValue(of(mockUniqueSizes));

    service.getUniqueSizes().subscribe((sizes) => {
      expect(sizes).toEqual(mockUniqueSizes);
    });

    expect(mockApiService.get).toHaveBeenCalledWith('stocks/unique-sizes'); // Updated endpoint
  });
});
