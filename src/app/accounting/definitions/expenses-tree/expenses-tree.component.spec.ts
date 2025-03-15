import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesTreeComponent } from './expenses-tree.component';

describe('ExpensesTreeComponent', () => {
  let component: ExpensesTreeComponent;
  let fixture: ComponentFixture<ExpensesTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensesTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
