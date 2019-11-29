import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTriggerInputComponent } from './form-trigger-input.component';

describe('FormTriggerInputComponent', () => {
  let component: FormTriggerInputComponent;
  let fixture: ComponentFixture<FormTriggerInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTriggerInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTriggerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
