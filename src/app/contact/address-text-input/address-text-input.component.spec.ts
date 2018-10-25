import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTextInputComponent } from './address-text-input.component';

describe('AddressTextInputComponent', () => {
  let component: AddressTextInputComponent;
  let fixture: ComponentFixture<AddressTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
