import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMultipleTextInputComponent } from './form-multiple-text-input.component';

describe('FormTextInputComponent', () => {
  let component: FormMultipleTextInputComponent;
  let fixture: ComponentFixture<FormMultipleTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormMultipleTextInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMultipleTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
