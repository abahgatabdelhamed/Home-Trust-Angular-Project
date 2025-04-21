/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MonthlyGoalServiceService } from './MonthlyGoalService.service';

describe('Service: MonthlyGoalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonthlyGoalServiceService]
    });
  });

  it('should ...', inject([MonthlyGoalServiceService], (service: MonthlyGoalServiceService) => {
    expect(service).toBeTruthy();
  }));
});
