import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCodeInputComponent } from './form-code-input.component';

describe('FormCodeInputComponent', () => {
  let component: FormCodeInputComponent;
  let fixture: ComponentFixture<FormCodeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCodeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
