import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { AssembellyStoneService } from './assembelly-stone.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

class MockApiService {
  post = jasmine.createSpy('post');
  get = jasmine.createSpy('get');
  delete = jasmine.createSpy('delete');
  update = jasmine.createSpy('update');
}

class MockAuthService {}

describe('AssembellyStoneService', () => {
  let service: AssembellyStoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    });
    service = TestBed.inject(AssembellyStoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apiService.get with correct productId for getStonesByProductId', () => {
    const apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    const productId = 123;
    service.getStonesByProductId(productId);
    expect(apiService.get).toHaveBeenCalledWith(`assembly_stones?product_id=${productId}`);
  });

});
