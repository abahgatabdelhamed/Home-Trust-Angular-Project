import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeInformationComponent } from './barcode-information.component';

describe('BarcodeInformationComponent', () => {
  let component: BarcodeInformationComponent;
  let fixture: ComponentFixture<BarcodeInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
