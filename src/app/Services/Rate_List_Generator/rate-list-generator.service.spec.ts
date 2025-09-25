import { TestBed } from '@angular/core/testing';

import { RateListGeneratorService } from './rate-list-generator.service';

describe('RateListGeneratorService', () => {
  let service: RateListGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateListGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
