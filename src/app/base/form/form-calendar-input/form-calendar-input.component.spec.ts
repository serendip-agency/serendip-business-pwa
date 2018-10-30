import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCalendarInputComponent } from './form-calendar-input.component';

describe('FormCalendarInputComponent', () => {
  let component: FormCalendarInputComponent;
  let fixture: ComponentFixture<FormCalendarInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCalendarInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCalendarInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
