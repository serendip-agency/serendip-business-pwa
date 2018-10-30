import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStateInputComponent } from './form-state-input.component';

describe('FormStateInputComponent', () => {
  let component: FormStateInputComponent;
  let fixture: ComponentFixture<FormStateInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStateInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
