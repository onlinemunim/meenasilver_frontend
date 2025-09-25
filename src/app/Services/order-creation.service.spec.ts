import { TestBed } from '@angular/core/testing';

import { OrderCreationService } from './order-creation.service';

describe('OrderCreationService', () => {
  let service: OrderCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
