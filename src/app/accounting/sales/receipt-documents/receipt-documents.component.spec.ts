import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDocumentsComponent } from './receipt-documents.component';

describe('ReceiptDocumentsComponent', () => {
  let component: ReceiptDocumentsComponent;
  let fixture: ComponentFixture<ReceiptDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
