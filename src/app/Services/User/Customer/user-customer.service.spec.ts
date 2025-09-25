import { TestBed } from '@angular/core/testing';

import { UserCustomerService } from './user-customer.service';

describe('UserCustomerService', () => {
  let service: UserCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
