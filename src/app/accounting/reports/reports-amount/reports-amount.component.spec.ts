import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAmountComponent } from './reports-amount.component';

describe('ReportsAmountComponent', () => {
  let component: ReportsAmountComponent;
  let fixture: ComponentFixture<ReportsAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
