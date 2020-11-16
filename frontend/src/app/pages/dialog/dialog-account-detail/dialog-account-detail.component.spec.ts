import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAccountDetailComponent } from './dialog-account-detail.component';

describe('DialogAccountDetailComponent', () => {
  let component: DialogAccountDetailComponent;
  let fixture: ComponentFixture<DialogAccountDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAccountDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
