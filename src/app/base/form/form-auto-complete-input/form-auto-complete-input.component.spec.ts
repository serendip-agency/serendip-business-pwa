import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAutoCompleteInputComponent } from './form-auto-complete-input.component';

describe('FormAutoCompleteInputComponent', () => {
  let component: FormAutoCompleteInputComponent;
  let fixture: ComponentFixture<FormAutoCompleteInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAutoCompleteInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAutoCompleteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
