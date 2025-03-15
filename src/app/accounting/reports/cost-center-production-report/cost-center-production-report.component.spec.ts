import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterProductionReportComponent } from './cost-center-production-report.component';

describe('CostCenterProductionReportComponent', () => {
  let component: CostCenterProductionReportComponent;
  let fixture: ComponentFixture<CostCenterProductionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostCenterProductionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterProductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
