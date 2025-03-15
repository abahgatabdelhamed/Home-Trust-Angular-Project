import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleDueAmountReportComponent } from './people-due-amount-report.component';

describe('PeopleDueAmountReportComponent', () => {
  let component: PeopleDueAmountReportComponent;
  let fixture: ComponentFixture<PeopleDueAmountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleDueAmountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleDueAmountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
