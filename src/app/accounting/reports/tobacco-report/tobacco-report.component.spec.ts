import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TobaccoReportComponent } from './tobacco-report.component';

describe('TobaccoReportComponent', () => {
  let component: TobaccoReportComponent;
  let fixture: ComponentFixture<TobaccoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TobaccoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TobaccoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
