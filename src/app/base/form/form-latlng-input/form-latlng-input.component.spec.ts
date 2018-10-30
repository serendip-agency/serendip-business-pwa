import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLatlngInputComponent } from './form-latlng-input.component';

describe('FormLatlngInputComponent', () => {
  let component: FormLatlngInputComponent;
  let fixture: ComponentFixture<FormLatlngInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLatlngInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLatlngInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
