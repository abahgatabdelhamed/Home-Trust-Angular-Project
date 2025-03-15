import { TestBed, inject } from '@angular/core/testing';

import { SideBarMenuService } from './side-bar-menu.service';

describe('SideBarMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SideBarMenuService]
    });
  });

  it('should be created', inject([SideBarMenuService], (service: SideBarMenuService) => {
    expect(service).toBeTruthy();
  }));
});
