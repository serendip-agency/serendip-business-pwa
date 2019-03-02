import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStorageInputComponent } from './form-storage-input.component';

describe('FormStorageInputComponent', () => {
  let component: FormStorageInputComponent;
  let fixture: ComponentFixture<FormStorageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStorageInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStorageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
