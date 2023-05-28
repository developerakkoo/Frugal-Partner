import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetPinPage } from './set-pin.page';

describe('SetPinPage', () => {
  let component: SetPinPage;
  let fixture: ComponentFixture<SetPinPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SetPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
