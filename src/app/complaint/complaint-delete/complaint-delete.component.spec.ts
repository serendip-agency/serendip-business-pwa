import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDeleteComponent } from './complaint-delete.component';

describe('ComplaintDeleteComponent', () => {
  let component: ComplaintDeleteComponent;
  let fixture: ComponentFixture<ComplaintDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
