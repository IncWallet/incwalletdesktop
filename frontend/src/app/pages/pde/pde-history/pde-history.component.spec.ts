import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdeHistoryComponent } from './pde-history.component';

describe('PdeHistoryComponent', () => {
  let component: PdeHistoryComponent;
  let fixture: ComponentFixture<PdeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
