import { TestBed } from '@angular/core/testing';

import { RouteParamsService } from './route-params.service';

describe('RouteParamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteParamsService = TestBed.get(RouteParamsService);
    expect(service).toBeTruthy();
  });
});
