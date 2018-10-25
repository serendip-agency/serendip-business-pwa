import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostalcodeInputComponent } from './postalcode-input.component';

describe('PostalcodeInputComponent', () => {
  let component: PostalcodeInputComponent;
  let fixture: ComponentFixture<PostalcodeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalcodeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalcodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
