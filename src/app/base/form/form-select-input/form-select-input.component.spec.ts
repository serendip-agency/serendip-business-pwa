import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectInputComponent } from './form-select-input.component';

describe('FormSelectInputComponent', () => {
  let component: FormSelectInputComponent;
  let fixture: ComponentFixture<FormSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
