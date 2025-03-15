import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertVarietiesComponent } from './convert-varieties.component';

describe('ConvertVarietiesComponent', () => {
  let component: ConvertVarietiesComponent;
  let fixture: ComponentFixture<ConvertVarietiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertVarietiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertVarietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
