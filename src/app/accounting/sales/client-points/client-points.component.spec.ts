import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPointsComponent } from './client-points.component';

describe('ClientPointsComponent', () => {
  let component: ClientPointsComponent;
  let fixture: ComponentFixture<ClientPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
