import { TestBed } from '@angular/core/testing';

import { NowTimeService } from './now-time.service';

describe('NowTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NowTimeService = TestBed.get(NowTimeService);
    expect(service).toBeTruthy();
  });
});
