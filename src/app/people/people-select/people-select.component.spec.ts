import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSelectComponent } from './people-select.component';

describe('PeopleSelectComponent', () => {
  let component: PeopleSelectComponent;
  let fixture: ComponentFixture<PeopleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
