import { TestBed } from '@angular/core/testing';
import { SharedProductService } from './shared-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { NotificationService } from '../notification.service';

class MockNotificationService {
  showSuccess = jasmine.createSpy();
  showError = jasmine.createSpy();
}

describe('SharedProductService', () => {
  let service: SharedProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SharedProductService,
        ApiService,
        { provide: NotificationService, useClass: MockNotificationService },
      ],
    });
    service = TestBed.inject(SharedProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
