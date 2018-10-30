import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingViewComponent } from './star-rating-view.component';

describe('StarRatingViewComponent', () => {
  let component: StarRatingViewComponent;
  let fixture: ComponentFixture<StarRatingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarRatingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarRatingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
