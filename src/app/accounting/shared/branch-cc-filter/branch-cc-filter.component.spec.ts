import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCcFilterComponent } from './branch-cc-filter.component';

describe('BranchCcFilterComponent', () => {
  let component: BranchCcFilterComponent;
  let fixture: ComponentFixture<BranchCcFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCcFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCcFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
