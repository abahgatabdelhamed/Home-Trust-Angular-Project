/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaticsServiceService } from './StaticsService.service';

describe('Service: StaticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticsServiceService]
    });
  });

  it('should ...', inject([StaticsServiceService], (service: StaticsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
