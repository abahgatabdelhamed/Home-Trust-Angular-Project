import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTablesComponent } from './view-tables.component';

describe('ViewTablesComponent', () => {
  let component: ViewTablesComponent;
  let fixture: ComponentFixture<ViewTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
