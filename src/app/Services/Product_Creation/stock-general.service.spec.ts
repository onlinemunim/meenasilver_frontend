import { TestBed } from '@angular/core/testing';
import { StockGeneralService } from './stock-general.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

describe('StockGeneralService', () => {
  let service: StockGeneralService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        StockGeneralService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(StockGeneralService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return products from getProducts()', () => {
    const mockData = [{ id: 1, name: 'Test Product' }];
    apiServiceSpy.get.and.returnValue(of(mockData));

    service.getProducts().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    expect(apiServiceSpy.get).toHaveBeenCalledWith('products');
  });

  it('should call createProducts()', () => {
    const product = { name: 'New Product' };
    apiServiceSpy.post.and.returnValue(of(product));

    service.createProducts(product).subscribe(data => {
      expect(data).toEqual(product);
    });
    expect(apiServiceSpy.post).toHaveBeenCalledWith('products', product);
  });

  it('should set and get product ID', () => {
    service.setProductId(123);
    expect(service.getProductId()).toBe(123);
  });

  it('should delete product by id', () => {
    const id = 10;
    apiServiceSpy.delete.and.returnValue(of({ success: true }));

    service.deleteProduct(id).subscribe(data => {
      expect(data).toEqual({ success: true });
    });
    expect(apiServiceSpy.delete).toHaveBeenCalledWith(`products/${id}`);
  });

  it('should get product by id', () => {
    const id = 5;
    const product = { id: 5, name: 'Product 5' };
    apiServiceSpy.get.and.returnValue(of(product));

    service.getProductById(id).subscribe(data => {
      expect(data).toEqual(product);
    });
    expect(apiServiceSpy.get).toHaveBeenCalledWith(`products/${id}`);
  });

  it('should call updateProduct with correct headers and url', () => {
    const id = 7;
    const formData = new FormData();
    const expectedResponse = { success: true };

    // Set a token in local storage
    localStorage.setItem('token', 'test-token');

    service.updateProduct(id, formData).subscribe(res => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}products/${id}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-HTTP-Method-Override')).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(expectedResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
