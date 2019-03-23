import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldValueCompareComponent } from './form-field-value-compare.component';

describe('FormFieldValueCompareComponent', () => {
  let component: FormFieldValueCompareComponent;
  let fixture: ComponentFixture<FormFieldValueCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldValueCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldValueCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
