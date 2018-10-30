import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPriceInputComponent } from './form-price-input.component';

describe('FormPriceInputComponent', () => {
  let component: FormPriceInputComponent;
  let fixture: ComponentFixture<FormPriceInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPriceInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPriceInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
