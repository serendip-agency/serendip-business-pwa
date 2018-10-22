import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSelectMultipleComponent } from './people-select-multiple.component';

describe('PeopleSelectMultipleComponent', () => {
  let component: PeopleSelectMultipleComponent;
  let fixture: ComponentFixture<PeopleSelectMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleSelectMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleSelectMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
