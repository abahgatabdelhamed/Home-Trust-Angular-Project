import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpurchComponent } from './rpurch.component';

describe('RpurchComponent', () => {
  let component: RpurchComponent;
  let fixture: ComponentFixture<RpurchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpurchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpurchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
