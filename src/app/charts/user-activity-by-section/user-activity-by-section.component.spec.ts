import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityBySectionComponent } from './user-activity-by-section.component';

describe('UserActivityBySectionComponent', () => {
  let component: UserActivityBySectionComponent;
  let fixture: ComponentFixture<UserActivityBySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActivityBySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivityBySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
