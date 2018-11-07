import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDateInputComponent } from './form-date-input.component';

describe('FormDateInputComponent', () => {
  let component: FormDateInputComponent;
  let fixture: ComponentFixture<FormDateInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDateInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
