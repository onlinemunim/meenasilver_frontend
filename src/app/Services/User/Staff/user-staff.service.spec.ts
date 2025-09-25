import { TestBed } from '@angular/core/testing';

import { UserStaffService } from './user-staff.service';

describe('UserStaffService', () => {
  let service: UserStaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
