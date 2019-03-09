import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHtmlInputComponent } from './form-html-input.component';

describe('FormHtmlInputComponent', () => {
  let component: FormHtmlInputComponent;
  let fixture: ComponentFixture<FormHtmlInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHtmlInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHtmlInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
