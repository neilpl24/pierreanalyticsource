import { TestBed } from '@angular/core/testing';

import { ScoresService } from './scores.service';

describe('ScoresService', () => {
  let service: ScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
