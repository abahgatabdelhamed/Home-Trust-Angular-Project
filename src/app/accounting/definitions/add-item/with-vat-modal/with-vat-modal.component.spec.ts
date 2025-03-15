import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithVatModalComponent } from './with-vat-modal.component';

describe('WithVatModalComponent', () => {
  let component: WithVatModalComponent;
  let fixture: ComponentFixture<WithVatModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithVatModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithVatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
