import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQuillInputComponent } from './form-quill-input.component';

describe('FormQuillInputComponent', () => {
  let component: FormQuillInputComponent;
  let fixture: ComponentFixture<FormQuillInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQuillInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQuillInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
