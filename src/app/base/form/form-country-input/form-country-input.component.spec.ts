import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCountryInputComponent } from './form-country-input.component';

describe('FormCountryInputComponent', () => {
  let component: FormCountryInputComponent;
  let fixture: ComponentFixture<FormCountryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCountryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCountryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
