import { TestBed } from '@angular/core/testing';

import { IconContractService } from './icon-contract.service';

describe('IconContractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IconContractService = TestBed.get(IconContractService);
    expect(service).toBeTruthy();
  });
});
