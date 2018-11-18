import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDateRangeInputComponent } from './form-date-range-input.component';

describe('FormDateRangeInputComponent', () => {
  let component: FormDateRangeInputComponent;
  let fixture: ComponentFixture<FormDateRangeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDateRangeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDateRangeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
