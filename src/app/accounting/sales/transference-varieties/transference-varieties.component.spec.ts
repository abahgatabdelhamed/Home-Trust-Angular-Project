import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenceVarietiesComponent } from './transference-varieties.component';

describe('TransferenceVarietiesComponent', () => {
  let component: TransferenceVarietiesComponent;
  let fixture: ComponentFixture<TransferenceVarietiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenceVarietiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenceVarietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
