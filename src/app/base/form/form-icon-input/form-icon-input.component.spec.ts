import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIconInputComponent } from './form-icon-input.component';

describe('FormIconInputComponent', () => {
  let component: FormIconInputComponent;
  let fixture: ComponentFixture<FormIconInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIconInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIconInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
