import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintSearchComponent } from './complaint-search.component';

describe('ComplaintSearchComponent', () => {
  let component: ComplaintSearchComponent;
  let fixture: ComponentFixture<ComplaintSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
