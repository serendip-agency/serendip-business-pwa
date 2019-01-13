import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPartsComponent } from './form-parts.component';

describe('FormPartsComponent', () => {
  let component: FormPartsComponent;
  let fixture: ComponentFixture<FormPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
