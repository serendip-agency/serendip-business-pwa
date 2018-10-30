import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTextViewComponent } from './long-text-view.component';

describe('LongTextViewComponent', () => {
  let component: LongTextViewComponent;
  let fixture: ComponentFixture<LongTextViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongTextViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
