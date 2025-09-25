import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockInService } from './stock-in.service';
import { environment } from '../../../../environments/environment';

describe('StockInService', () => {
  let service: StockInService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockInService]
    });

    service = TestBed.inject(StockInService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stock in entries', () => {
    const dummyResponse = [{ id: 1, name: 'Entry 1' }];

    service.getStockInEntries(null).subscribe(res => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}stock_ins`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should have default stockInId$ as null', (done) => {
    service.stockInId$.subscribe(value => {
      expect(value).toBeNull();
      done();
    });
  });
});
