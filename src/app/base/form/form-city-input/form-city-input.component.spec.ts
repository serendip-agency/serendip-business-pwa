import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCityInputComponent } from './form-city-input.component';

describe('FormCityInputComponent', () => {
  let component: FormCityInputComponent;
  let fixture: ComponentFixture<FormCityInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCityInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCityInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
