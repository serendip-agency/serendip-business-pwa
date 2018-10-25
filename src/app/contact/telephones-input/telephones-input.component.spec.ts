import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonesInputComponent } from './telephones-input.component';

describe('TelephonesInputComponent', () => {
  let component: TelephonesInputComponent;
  let fixture: ComponentFixture<TelephonesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephonesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
