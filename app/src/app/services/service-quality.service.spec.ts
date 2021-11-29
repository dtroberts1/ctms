import { TestBed } from '@angular/core/testing';

import { ServiceQualityService } from './service-quality.service';

describe('ServiceQualityService', () => {
  let service: ServiceQualityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceQualityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
