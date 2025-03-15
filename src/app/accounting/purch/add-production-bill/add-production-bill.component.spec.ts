import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionBillComponent } from './add-production-bill.component';

describe('AddProductionBillComponent', () => {
  let component: AddProductionBillComponent;
  let fixture: ComponentFixture<AddProductionBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductionBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductionBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
