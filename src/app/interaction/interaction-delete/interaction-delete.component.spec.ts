import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDeleteComponent } from './interaction-delete.component';

describe('InteractionDeleteComponent', () => {
  let component: InteractionDeleteComponent;
  let fixture: ComponentFixture<InteractionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
