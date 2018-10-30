import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMobileInputComponent } from './form-mobile-input.component';

describe('FormMobileInputComponent', () => {
  let component: FormMobileInputComponent;
  let fixture: ComponentFixture<FormMobileInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMobileInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMobileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
