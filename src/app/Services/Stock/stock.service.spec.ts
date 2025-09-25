import { TestBed } from '@angular/core/testing';
import { StockService } from './stock.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

class MockApiService {
  get = jasmine.createSpy('get');
  post = jasmine.createSpy('post');
  delete = jasmine.createSpy('delete');
}

describe('StockService', () => {
  let service: StockService;
  let apiService: MockApiService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const apiUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [{ provide: ApiService, useClass: MockApiService }],
    });

    service = TestBed.inject(StockService);
    apiService = TestBed.inject(ApiService) as any;
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get stock entries using ApiService.get()', () => {
    const mockResponse = { data: [{ id: 1, name: 'Item A' }] };
    apiService.get.and.returnValue(of(mockResponse));

    service.getStockEntries().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith('stocks');
  });

  it('should get a stock entry by ID using ApiService.get()', () => {
    const mockResponse = { data: { id: 1, name: 'Item B' } };
    apiService.get.and.returnValue(of(mockResponse));

    service.getStockEntryById(1).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith('stocks/1');
  });

  it('should create a stock entry using ApiService.post()', () => {
    const formData = new FormData();
    const mockResponse = { success: true };
    apiService.post.and.returnValue(of(mockResponse));

    service.createStockEntry(formData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith('stocks', formData);
  });

  it('should delete a stock entry using ApiService.delete()', () => {
    const mockResponse = { success: true };
    apiService.delete.and.returnValue(of(mockResponse));

    service.deleteStockEntry(1).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.delete).toHaveBeenCalledWith('stocks/1');
  });

  it('should update a stock entry using HttpClient POST with PUT override header', () => {
    const formData = new FormData();
    const mockResponse = { success: true };
    const id = 123;

    localStorage.setItem('token', 'fake-token');

    service.updateStockEntry(id, formData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}stocks/${id}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-HTTP-Method-Override')).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockResponse);
  });
});
