import { TestBed } from '@angular/core/testing';

import { SeasonService } from './season.service';

describe('SeasonServiceService', () => {
  let service: SeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
