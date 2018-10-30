import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChipsInputComponent } from './form-chips-input.component';

describe('FormChipsInputComponent', () => {
  let component: FormChipsInputComponent;
  let fixture: ComponentFixture<FormChipsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormChipsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChipsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
