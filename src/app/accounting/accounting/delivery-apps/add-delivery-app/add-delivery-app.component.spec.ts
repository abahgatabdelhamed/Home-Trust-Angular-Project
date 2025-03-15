import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryAppComponent } from './add-delivery-app.component';

describe('AddDeliveryAppComponent', () => {
  let component: AddDeliveryAppComponent;
  let fixture: ComponentFixture<AddDeliveryAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeliveryAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeliveryAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
