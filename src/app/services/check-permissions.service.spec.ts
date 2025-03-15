import { TestBed, inject } from '@angular/core/testing';

import { CheckPermissionsService } from './check-permissions.service';

describe('CheckPermissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckPermissionsService]
    });
  });

  it('should be created', inject([CheckPermissionsService], (service: CheckPermissionsService) => {
    expect(service).toBeTruthy();
  }));
});
