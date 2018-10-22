import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSelectSingleComponent } from './people-select-single.component';

describe('PeopleSelectSingleComponent', () => {
  let component: PeopleSelectSingleComponent;
  let fixture: ComponentFixture<PeopleSelectSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleSelectSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleSelectSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
