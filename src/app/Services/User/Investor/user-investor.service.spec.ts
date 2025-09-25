import { TestBed } from '@angular/core/testing';

import { UserInvestorService } from './user-investor.service';

describe('UserInvestorService', () => {
  let service: UserInvestorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInvestorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
