import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectidViewComponent } from './objectid-view.component';

describe('ObjectidViewComponent', () => {
  let component: ObjectidViewComponent;
  let fixture: ComponentFixture<ObjectidViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectidViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectidViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
