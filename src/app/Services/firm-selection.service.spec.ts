import { TestBed } from '@angular/core/testing';

import { FirmSelectionService } from './firm-selection.service';

describe('FirmSelectionService', () => {
  let service: FirmSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirmSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
