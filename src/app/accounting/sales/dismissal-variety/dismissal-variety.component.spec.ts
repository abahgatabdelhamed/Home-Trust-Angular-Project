import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismissalVarietyComponent } from './dismissal-variety.component';

describe('DismissalVarietyComponent', () => {
  let component: DismissalVarietyComponent;
  let fixture: ComponentFixture<DismissalVarietyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismissalVarietyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismissalVarietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
