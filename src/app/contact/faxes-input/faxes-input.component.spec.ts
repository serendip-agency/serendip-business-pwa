import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaxesInputComponent } from './faxes-input.component';

describe('FaxesInputComponent', () => {
  let component: FaxesInputComponent;
  let fixture: ComponentFixture<FaxesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaxesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaxesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
