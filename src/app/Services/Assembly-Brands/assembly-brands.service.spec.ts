import { TestBed } from '@angular/core/testing';

import { AssemblyBrandsService } from './assembly-brands.service';

describe('AssemblyBrandsService', () => {
  let service: AssemblyBrandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssemblyBrandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
