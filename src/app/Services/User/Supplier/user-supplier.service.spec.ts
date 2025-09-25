import { TestBed } from '@angular/core/testing';

import { UserSupplierService } from './user-supplier.service';

describe('UserSupplierService', () => {
  let service: UserSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
