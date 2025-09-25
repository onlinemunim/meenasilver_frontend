import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockOutService } from './stock-out.service';
import { environment } from '../../../../environments/environment';

describe('StockOutService', () => {
  let service: StockOutService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockOutService]
    });

    service = TestBed.inject(StockOutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies no pending HTTP calls
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stock out entries', () => {
    const mockResponse = [{ id: 1, name: 'StockOut A' }];
    const params = { status: 'approved' };

    service.getStockOutEntries(params).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req =>
      req.url === `${environment.apiBaseUrl}stock_outs` &&
      req.params.get('status') === 'approved'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should emit null as initial stockOutId$', (done) => {
    service.stockOutId$.subscribe(id => {
      expect(id).toBeNull();
      done();
    });
  });

  it('should update stockOutId$', (done) => {
    service.setStockOutId(42);

    service.stockOutId$.subscribe(id => {
      expect(id).toBe(42);
      done();
    });
  });
});
