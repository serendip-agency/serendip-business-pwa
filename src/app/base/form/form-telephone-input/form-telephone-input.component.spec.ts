import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTelephoneInputComponent } from './form-telephone-input.component';

describe('FormTelephoneInputComponent', () => {
  let component: FormTelephoneInputComponent;
  let fixture: ComponentFixture<FormTelephoneInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTelephoneInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTelephoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
