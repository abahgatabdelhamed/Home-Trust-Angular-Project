import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesTemplateComponent } from './expenses-template.component';

describe('ExpensesTemplateComponent', () => {
  let component: ExpensesTemplateComponent;
  let fixture: ComponentFixture<ExpensesTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensesTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
