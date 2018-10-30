import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRatingViewComponent } from './club-rating-view.component';

describe('ClubRatingViewComponent', () => {
  let component: ClubRatingViewComponent;
  let fixture: ComponentFixture<ClubRatingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRatingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRatingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
