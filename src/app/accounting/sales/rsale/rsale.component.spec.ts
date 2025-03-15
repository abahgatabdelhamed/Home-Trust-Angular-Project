import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsaleComponent } from './rsale.component';

describe('RsaleComponent', () => {
  let component: RsaleComponent;
  let fixture: ComponentFixture<RsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
