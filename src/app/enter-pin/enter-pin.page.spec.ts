import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterPinPage } from './enter-pin.page';

describe('EnterPinPage', () => {
  let component: EnterPinPage;
  let fixture: ComponentFixture<EnterPinPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnterPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
