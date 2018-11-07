import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRelativeDateInputComponent } from './form-relative-date-input.component';

describe('FormRelativeDateInputComponent', () => {
  let component: FormRelativeDateInputComponent;
  let fixture: ComponentFixture<FormRelativeDateInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRelativeDateInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRelativeDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
