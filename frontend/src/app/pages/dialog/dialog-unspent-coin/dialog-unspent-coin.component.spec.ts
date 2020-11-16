import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnspentCoinComponent } from './dialog-unspent-coin.component';

describe('DialogUnspentCoinComponent', () => {
  let component: DialogUnspentCoinComponent;
  let fixture: ComponentFixture<DialogUnspentCoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnspentCoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnspentCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
