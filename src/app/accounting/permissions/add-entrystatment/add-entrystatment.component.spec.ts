import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntrystatmentComponent } from './add-entrystatment.component';

describe('AddEntrystatmentComponent', () => {
  let component: AddEntrystatmentComponent;
  let fixture: ComponentFixture<AddEntrystatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntrystatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntrystatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
