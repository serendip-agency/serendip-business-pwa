import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortTextViewComponent } from './short-text-view.component';

describe('ShortTextViewComponent', () => {
  let component: ShortTextViewComponent;
  let fixture: ComponentFixture<ShortTextViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortTextViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
