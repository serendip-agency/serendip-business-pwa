import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormToggleInputComponent } from './form-toggle-input.component';

describe('FormToggleInputComponent', () => {
  let component: FormToggleInputComponent;
  let fixture: ComponentFixture<FormToggleInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormToggleInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormToggleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
