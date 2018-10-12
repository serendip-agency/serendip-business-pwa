import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarScheduleComponent } from './calendar-schedule.component';

describe('CalendarScheduleComponent', () => {
  let component: CalendarScheduleComponent;
  let fixture: ComponentFixture<CalendarScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
