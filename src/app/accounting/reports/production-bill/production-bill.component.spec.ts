import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionBillComponent } from './production-bill.component';

describe('ProductionBillComponent', () => {
  let component: ProductionBillComponent;
  let fixture: ComponentFixture<ProductionBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
